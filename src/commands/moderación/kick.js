const { SlashCommandBuilder } = require('@discordjs/builders'); // Constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Embeds para mensajes

module.exports = {
    data: new SlashCommandBuilder() // Define comando slash
        .setName('kick') // Nombre: kick
        .setDescription('Expulsas a un usuario del servidor.') // Descripción
        .addUserOption(option => option.setName('usuario').setDescription('Usuario al que quieres expulsar.').setRequired(true)) // Usuario obligatorio
        .addStringOption(option => option.setName('razón').setDescription('Especifica la razón del baneo.')), // Razón opcional (nota: dice "baneo" pero es para kick)
    async run(client, interaction, language) { // Función ejecutada al usar comando
        const usermember = interaction.options.getMember('usuario'); // Obtiene el miembro (con roles, permisos, etc.)
        const razon = interaction.options.getString('razón') || client.languages.__({ phrase: 'kick.kreasonNotEspecified', locale: language }); // Razón o mensaje por defecto

        if (!interaction.member.permissions.has('KICK_MEMBERS')) { // Verifica si el usuario tiene permiso KICK_MEMBERS
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) }); // "No tienes permisos"
        };

        if (usermember.roles.highest.position >= interaction.member.roles.highest.position) { // Verifica jerarquía de roles
            return interaction.reply({ content: client.languages.__({ phrase: 'kick.kdonthighest', locale: language }) }); // "No puedes expulsar a alguien con igual o mayor rol"
        };

        if (!usermember) { // Verifica si se obtuvo un miembro válido
            return interaction.reply({ content: client.languages.__({ phrase: 'utilies.youNeedMention', locale: language }) }); // "Debes mencionar a un usuario"
        };

        await usermember.send({ content: client.languages.__mf({ phrase: 'kick.kusermembermd', locale: language }, { server: interaction.guild.name, reason: razon }) }) // Envía MD al usuario expulsado

        usermember.kick(razon); // Ejecuta la expulsión (kick) con la razón

        const kickEmbed = new MessageEmbed() // Crea embed de confirmación
        .setTimestamp() // Marca de tiempo
        .setColor('GREEN') // Color verde (éxito)
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: quien ejecutó el comando
        .setDescription(client.languages.__({ phrase: 'moderation.userkicked', locale: language })) // "Usuario expulsado correctamente"
        .addField('Usuario Tag:', "```" + `${usermember.user.tag}` + "```", true) // Tag del usuario en bloque de código
        .addField('Usuario Id:', "```" + `${usermember.user.id}` + "```", true) // ID del usuario en bloque de código
        .addField('Razón del kick:', `${razon}`, false) // Razón del kick
        .setThumbnail(usermember.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // Avatar del usuario expulsado en alta resolución
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie con nombre e ícono del servidor
        return interaction.reply({ embeds: [kickEmbed] }); // Envía embed como respuesta
    }
};