const fs = require('fs'); // Módulo para trabajar con sistema de archivos
const categories = fs.readdirSync('./src/commands'); // Lee carpetas de categorías de comandos de forma síncrona

module.exports = (client) => { // Exporta función que recibe el cliente como parámetro
    categories.forEach(async (category) => { // Itera sobre cada categoría (administración, diversión, etc.)
        fs.readdir(`./src/commands/${category}`, (err) => { // Lee contenido de cada carpeta de categoría
            if (err) return console.error(err); // Si hay error, lo muestra

            const commands = fs.readdirSync(`./src/commands/${category}`).filter((archivo) => archivo.endsWith('.js')); // Filtra solo archivos .js

            for (const archivo of commands) { // Itera sobre cada archivo de comando
                const command = require(`../commands/${category}/${archivo}`); // Importa el módulo del comando

                client.commands.set(command.data.name, command); // Guarda el comando en la colección del cliente usando su nombre como clave
            };
        });
    });
};