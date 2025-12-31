const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const ms = require('ms'); // Para convertir cadenas de tiempo a milisegundos

module.exports = {
    data: new SlashCommandBuilder()
        .setName('clear') // Limpiar mensajes
        .setDescription('Elimina mensajes ya sea a un usuario o en general.')
        .addStringOption(option => option.setName('cantidad').setDescription('Cantidad de mensajes a eliminar.').setRequired(true)) // Cantidad obligatoria
        .addUserOption(option => option.setName('usuario').setDescription('Usuario cuyo información quieres ver.')), // Usuario opcional
    async run(client, interaction, language) {
        const amountsv = interaction.options.getString('cantidad'); // Cantidad como string
        const usermember = interaction.options.getUser('usuario'); // Usuario si se especificó
        const canal = interaction.channel; // Canal actual
        const mensajes = canal.messages.fetch(); // Obtiene mensajes del canal

        if (!interaction.member.permissions.has('MANAGE_MESSAGES')) { // Permiso para gestionar mensajes
            return interaction.reply({ content: client.languages.__({ phrase: 'lang.noHavePermsAdmin', locale: language }) });
        };

        if (isNaN(amountsv)) return interaction.reply({ content: client.languages.__({ phrase: 'clear.solonums', locale: language }) }); // Solo números

        if (amountsv >= 101) return interaction.reply({ content: client.languages.__({ phrase: 'clear.more101', locale: language }) }); // Máximo 100
        if (amountsv <= 0) return interaction.reply({ content: client.languages.__({ phrase: 'clear.0ormenos', locale: language }) }); // Mínimo 1

        if (!(await mensajes).filter((msg) => Date.now() - msg.createdTimestamp < ms('14 days'))) return interaction.reply({ content: client.languages.__({ phrase: 'clear.noMore14days', locale: language }) }); // Discord no permite borrar mensajes de >14 días con bulkDelete

        if (usermember) { // Si se especificó un usuario
            const usuarioMensajes = (await mensajes).filter((m) => m.author.id === usermember.id); // Filtra mensajes de ese usuario
            await canal.bulkDelete(usuarioMensajes, true); // Borra solo sus mensajes

            const userEmbed = new MessageEmbed()
            .setTimestamp()
            .setColor('GREEN')
            .setAuthor(`${usermember.tag}`, usermember.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setDescription(client.languages.__mf({ phrase: 'moderation.userobjective', locale: language }, { messages: amountsv, usuario: usermember.username })) // "X mensajes eliminados del usuario Y"
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
            return interaction.reply({ embeds: [userEmbed] });
        } else { // Si NO se especificó usuario (borrar todos)
            await canal.bulkDelete(amountsv, true); // Borra la cantidad especificada

            const userEmbed2 = new MessageEmbed()
            .setTimestamp()
            .setColor('GREEN')
            .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
            .setDescription(client.languages.__mf({ phrase: 'moderation.clearobjective', locale: language }, { messages: amountsv })) // "X mensajes eliminados"
            .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
            return interaction.reply({ embeds: [userEmbed2] });
        };
    }
};