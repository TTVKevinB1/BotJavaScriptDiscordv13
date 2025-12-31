const { Intents, Client, Collection } = require('discord.js'); // Importa componentes de Discord.js v13
require('dotenv').config(); // Carga variables de entorno desde .env
const { join } = require('path'); // Para rutas de archivos multiplataforma
const { setInterval } = require('timers'); // Temporizadores

const fs = require('fs'); // Sistema de archivos
const { REST } = require('@discordjs/rest'); // Cliente REST para API de Discord
const { Routes } = require('discord-api-types/v9'); // Rutas de API v9

const { clientId, guildId, token } = require('./src/config/config.json'); // Configuración desde JSON (¡CUIDADO! token expuesto)
const rest = new REST({ version: '9' }).setToken(token); // Cliente REST con versión 9 de API
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_VOICE_STATES] }); // Crea cliente con intents necesarios
client.commands = new Collection(); // Colección para comandos
client.selectMenus = new Collection(); // Colección para menús desplegables (no usado actualmente)
client.languages = require('i18n'); // Sistema de internacionalización

module.exports = client; // Exporta cliente para usar en otros módulos

client.languages.configure({ // Configura i18n para múltiples idiomas
    locales: ['es', 'en'], // Idiomas soportados
    directory: join(__dirname, 'locales'), // Carpeta de archivos de traducción
    defaultLocale: 'es', // Idioma por defecto
    retryInDefaultLocale: true, // Si falla traducción, usa idioma por defecto
    objectNotation: true, // Usar notación de objetos para claves
    register: global, // Registra globalmente

    logWarnFN: function (msg) { // Función para warnings
        console.log(`WARN: ` + msg);
    },

    logErrorFn: function (msg) { // Función para errores
        console.log(`ERROR: ` + msg);
    },

    missingKeyFn: function (locale, value) { // Si falta traducción
        return value; // Devuelve el valor original
    },

    mustacheConfig: { // Configuración para plantillas {{ }}
        tags: ['{{', '}}'],
        disable: false
    }
});

setInterval(() => { // Actualiza estado del bot cada 30 segundos
    updateStatus();
}, 30000);

createSlash(); // Crea/actualiza comandos slash

require('./src/handlers/events.js')(client); // Carga eventos
require('./src/handlers/commands.js')(client); // Carga comandos

client.login(process.env.token); // Inicia sesión con token desde variables de entorno
// Nota: Aquí usa process.env.token pero también importa token de config.json
// Posible conflicto: debería usar solo uno

async function updateStatus() { // Función para actualizar estado (presencia) del bot
    const guildNum = await client.guilds.cache.size; // Número de servidores
    const memberNum = await client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0); // Total de miembros

    await client.user.setActivity(`Servers: ${guildNum} | Usuarios: ${memberNum}`, { type: 'LISTENING' }); // Establece actividad
    // Ejemplo: "Escuchando Servers: 50 | Usuarios: 10000"
};

async function createSlash() { // Función para registrar comandos slash en Discord
    try {
        const commands = []; // Array para comandos
        fs.readdirSync('./src/commands').forEach(async(category) => { // Itera categorías
            const commandFiles = fs.readdirSync(`./src/commands/${category}`).filter((archivo) => archivo.endsWith('.js')); // Filtra .js

            for (const archivo of commandFiles) { // Itera archivos
                const command = require(`./src/commands/${category}/${archivo}`); // Importa comando
                
                commands.push(command.data.toJSON()); // Convierte a JSON y añade al array
            };
        });

        console.log('Se esta refrescando los slash commands (/).'); // Log

        await rest.put( // Envía todos los comandos a Discord API
            Routes.applicationCommands(clientId), // Ruta para comandos globales
            { body: commands } // Cuerpo con comandos
        );

        console.log('Se ha publicado los slash commands (/).'); // Log éxito
    } catch(e) {
        console.error(e); // Manejo de errores
    };
};