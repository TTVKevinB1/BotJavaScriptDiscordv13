const { SlashCommandBuilder } = require('@discordjs/builders');
const Discord = require('discord.js'); // Importa Discord completo
const moment = require('moment'); // Para manejar fechas
const osu = require('node-os-utils'); // Para info del sistema
const os = require('os'); // Info del sistema nativo
require('moment-duration-format'); // Extensión para formatear duraciones
const diagramMaker = require('../../functions/diagramMaker.js'); // Función personalizada para diagramas

module.exports = {
    data: new SlashCommandBuilder()
        .setName('status') // Comando de estado detallado
        .setDescription('Muestra el estado actual del bot.'),
    async run(client, interaction, language) {
        interaction.reply({ content: client.languages.__({ phrase: 'status.obtencion', locale: language }) }); // Mensaje "obteniendo datos"

        const totalGuilds = client.guilds.cache.size; // Número de servidores
        const totalMembers = await client.guilds.cache.reduce((prev, guild) => prev + guild.memberCount, 0); // Total miembros sumando todos los servidores

        var mem = osu.mem; // Objeto para memoria
        let freeRAM, usedRAM, cpuUsage; // Variables para almacenar datos

        mem.info().then(info => { // Obtiene info de memoria
            freeRAM = info['freeMemMb']; // RAM libre en MB
            usedRAM = info['totalMemMb'] - freeRAM; // RAM usada
        });

        const cpu = osu.cpu;
        const p1 = cpu.usage().then(cpuPercentage => { // Obtiene uso de CPU
            cpuUsage = cpuPercentage; // Porcentaje de CPU
        });

        await Promise.all([p1]); // Espera a que termine de obtener datos de CPU

        const statusEmbed = new Discord.MessageEmbed()
        .setTimestamp()
        .setColor('GREEN')
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: 'status.estado', locale: language }, { client: client.user.username })) // Estado del bot
        .addField('Rendimiento General:', "```" + `RAM: ${diagramMaker(usedRAM, freeRAM)} [${Math.round((100 * usedRAM) / (usedRAM + freeRAM))}%]\nCPU: ${diagramMaker(cpuUsage, 100 - cpuUsage)} [${Math.round(cpuUsage)}%]` + "```", false) // Diagramas de RAM y CPU
        .addField('Sistema Procesador:', "```" + `Intel ${(os.totalmem() / 1024 / 1024 / 1024).toFixed(2)} GB` + "```", false) // Memoria total
        .addField('Sistema Operativo:', "```" + `${os.type} ${os.release} ${os.arch}` + "```", false) // SO y arquitectura
        .addField('Total de Servidores:', "```" + `${totalGuilds}` + "```", true) // Servidores
        .addField('Total de Usuarios:', "```" + `${totalMembers}` + "```", true) // Usuarios totales
        .addField('Total de Emoticonos:', "```" + `${client.emojis.cache.size}` + "```", true) // Emojis cacheados
        .addField('Actividad Bot:', "```" + `${moment.duration(client.uptime).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}` + "```", false) // Tiempo activo del bot
        .addField('Actividad Host:', "```" + `${moment.duration(os.uptime * 1000).format(`D [Días], H [Horas], m [Minutos], s [Segundos]`)}` + "```", false) // Tiempo activo del servidor
        .addField('Última Conexión:', "```" + `${moment(client.readyAt).format("DD/MMM/YYYY - HH:mma")}` + "```", false) // Última vez que se conectó
        .setThumbnail(client.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // Avatar del bot en alta resolución
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        interaction.editReply({ content: ' ', embeds: [statusEmbed] }); // Reemplaza mensaje "obteniendo datos" con el embed
    }
};