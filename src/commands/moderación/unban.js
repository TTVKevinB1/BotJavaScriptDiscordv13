const { SlashCommandBuilder } = require('@discordjs/builders'); // Constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Embeds para mensajes

module.exports = {
    data: new SlashCommandBuilder() // Define comando slash
        .setName('unban') // Nombre: unban
        .setDescription('Desbaneas a un usuario del servidor.') // Descripción
        .addStringOption(option => option.setName('usuario').setDescription('Ingresa el ID del usuario al que quieres desbanear.').setRequired(true)), // ID del usuario como string (obligatorio)
    async run(client, interaction, language) { // Función ejecutada al usar comando
        const usermember = interaction.options.getString('usuario'); // Obtiene el ID del usuario como string (no como objeto miembro)

        if (!interaction.member.permissions.has('BAN_MEMBERS')) { // Verifica permiso BAN_MEMBERS (necesario para desbanear también)
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) }); // "No tienes permisos"
        };

        if (!usermember) { // Verifica si se proporcionó un ID
            return interaction.reply({ content: client.languages.__({ phrase: 'utilies.youNeedIdUser', locale: language }) }); // "Debes proporcionar un ID de usuario"
        };

        interaction.guild.members.unban(usermember).then((useruser) => { // Intenta desbanear al usuario por su ID
            const unbanEmbed = new MessageEmbed() // Crea embed de éxito
            .setTimestamp() // Marca de tiempo
            .setColor('GREEN') // Color verde
            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor: quien ejecutó el comando
            .setDescription(client.languages.__({ phrase: 'moderation.userdesbanned', locale: language })) // "Usuario desbaneado correctamente"
            .addField('Usuario Tag:', "```" + `${useruser.tag}` + "```", true) // Tag del usuario desbaneado (obtenido del objeto retornado)
            .addField('Usuario Id:', "```" + `${useruser.id}` + "```", true) // ID del usuario desbaneado
            .setThumbnail(interaction.guild.iconURL({ dynamic: true, format: 'png', size: 4096 })) // Miniatura con ícono del servidor (no avatar del usuario porque no está en el servidor)
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
            interaction.reply({ embeds: [unbanEmbed] }); // Envía embed
        }).catch(e => { // Captura errores
            console.log(e); // Muestra error en consola
            return interaction.reply({ content: client.languages.__({ phrase: 'unban.userNotFound', locale: language }) }); // "Usuario no encontrado en la lista de baneados"
        });
    }
};