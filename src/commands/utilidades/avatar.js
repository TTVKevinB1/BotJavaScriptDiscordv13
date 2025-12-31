const { SlashCommandBuilder } = require('@discordjs/builders'); // Constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Embeds para mensajes

module.exports = {
    data: new SlashCommandBuilder() // Define comando slash
        .setName('avatar') // Nombre: avatar
        .setDescription('Envia el avatar del usuario o el tuyo.') // Descripción
        .addUserOption(option => option.setName('usuario').setDescription('Usuario cuyo avatar quieres ver.')), // Usuario opcional
    async run(client, interaction, language) { // Función ejecutada al usar comando
        const user = interaction.options.getUser('usuario'); // Obtiene usuario (no miembro, solo datos básicos)

        if (user) { // Si se especificó un usuario
            const avatarEmbed = new MessageEmbed() // Crea embed para avatar del usuario especificado
            .setTimestamp() // Marca de tiempo
            .setColor('GREEN') // Color verde
            .setAuthor(`${user.tag}`, user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: el usuario consultado
            .setDescription(client.languages.__mf({ phrase: 'avatar.objective', locale: language }, { username: user.username })) // "Avatar de [usuario]"
            .setImage(user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // IMAGEN PRINCIPAL: avatar en tamaño máximo (4096x4096)
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
            return interaction.reply({ embeds: [avatarEmbed] }); // Envía embed
        } else { // Si NO se especificó usuario (muestra avatar propio)
            const avatarEmbed1 = new MessageEmbed() // Crea embed para avatar propio
            .setTimestamp() // Marca de tiempo
            .setColor('GREEN') // Color verde
            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: quien ejecutó el comando
            .setDescription(client.languages.__({ phrase: 'avatar.self', locale: language })) // "Mi avatar"
            .setImage(interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // Avatar propio en tamaño máximo
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
            return interaction.reply({ embeds: [avatarEmbed1] }); // Envía embed
        };
    }
};