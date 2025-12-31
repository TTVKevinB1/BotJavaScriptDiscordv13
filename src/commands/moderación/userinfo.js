const { SlashCommandBuilder } = require('@discordjs/builders'); // Constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Embeds para mensajes
const moment = require('moment'); // Para formatear fechas

module.exports = {
    data: new SlashCommandBuilder() // Define comando slash
        .setName('userinfo') // Nombre: userinfo
        .setDescription('Muestra información completa del usuario.') // Descripción
        .addUserOption(option => option.setName('usuario').setDescription('Usuario cuyo información quieres ver.')), // Usuario opcional
    async run(client, interaction, language) { // Función ejecutada al usar comando
        const usermember = interaction.options.getMember('usuario'); // Obtiene miembro si se especificó

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) { // Verifica permiso MANAGE_MESSAGES (requerido para usar este comando)
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) }); // "No tienes permisos"
        };

        if (usermember) { // Si se especificó un usuario
            const userInfoEmbed = new MessageEmbed() // Crea embed para información del usuario especificado
            .setTimestamp() // Marca de tiempo
            .setColor('GREEN') // Color verde
            .setAuthor(`${usermember.user.tag}`, usermember.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: el usuario consultado
            .setDescription(client.languages.__mf({ phrase: 'moderation.infouser', locale: language }, { username: usermember.user.username })) // "Información de [usuario]"
            .addField('Usuario Tag:', "```" + `${usermember.user.tag}` + "```", true) // Tag completo
            .addField('Usuario Id:', "```" + `${usermember.user.id}` + "```", true) // ID del usuario
            .addField('Entro al Servidor:', "```" + `${moment(usermember.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(usermember.joinedAt).startOf('day').fromNow()})` + "```", false) // Fecha de entrada formateada + "hace X tiempo"
            .addField('Creación de Cuenta:', "```" + `${moment(usermember.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(usermember.user.createdAt).startOf('day').fromNow()})` + "```", false) // Fecha creación cuenta Discord
            .addField('Roles del Usuario:', `${usermember.roles.cache.map(r => r).join(' ')}`, false) // Lista todos los roles del usuario
            .setThumbnail(usermember.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // Avatar grande del usuario
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
            return interaction.reply({ embeds: [userInfoEmbed] }); // Envía embed
        } else { // Si NO se especificó usuario (muestra info del que ejecutó el comando)
            const userInfoEmbed1 = new MessageEmbed() // Crea embed para información propia
            .setTimestamp() // Marca de tiempo
            .setColor('GREEN') // Color verde
            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: quien ejecutó el comando
            .setDescription(client.languages.__({ phrase: 'moderation.myinfo', locale: language })) // "Mi información"
            .addField('Usuario Nombre:', "```" + `${interaction.user.username}` + "```", true) // Solo nombre de usuario (no tag completo)
            .addField('Usuario Id:', "```" + `${interaction.user.id}` + "```", true) // ID del usuario
            .addField('Entro al Servidor:', "```" + `${moment(interaction.joinedAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(interaction.joinedAt).startOf('day').fromNow()})` + "```", false) // Fecha de entrada al servidor
            .addField('Creación de Cuenta:', "```" + `${moment(interaction.user.createdAt).format('MMMM Do YYYY, h:mm:ss a')} (${moment(interaction.user.createdAt).startOf('day').fromNow()})` + "```", false) // Fecha creación cuenta
            .addField('Roles del Usuario:', `${interaction.member.roles.cache.map(r => r).join(' ')}`, false) // Roles del usuario actual
            .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png', size: 4096 })) // Avatar propio
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
            return interaction.reply({ embeds: [userInfoEmbed1] }); // Envía embed
        };
    }
};