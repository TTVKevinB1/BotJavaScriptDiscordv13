const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');
const fetch = require('node-fetch'); // Para hacer peticiones HTTP a la API de Discord

module.exports = {
    data: new SlashCommandBuilder()
        .setName('chess') // Comando para ajedrez
        .setDescription('Crea una sesión de Ajedrez.')
        .addBooleanOption(option => option.setName('ilimitado').setDescription('Activa la opción para que el enlace sea permanente y nunca finalice.')), // Opción para enlace permanente
    async run(client, interaction, language) {
        await interaction.reply({ content: client.languages.__({ phrase: 'sesiones.chessloading', locale: language }) }); // "Cargando ajedrez"

        if (!interaction.member.voice.channel) { // Verifica que el usuario esté en un canal de voz
            return interaction.editReply({ content: client.languages.__({ phrase: 'sesiones.nochannel', locale: language }) }); // "No estás en un canal de voz"
        };

        if (interaction.options._hoistedOptions[0]?.value) { // Si seleccionó "ilimitado: true"
            createCodeChess(client, interaction.member.voice.channel.id, 'ID', 0).then(invite => { // ID de aplicación del ajedrez de Discord
                const interEmbed = new MessageEmbed()
                .setTimestamp()
                .setColor('GREEN')
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`**[Haz click aquí para ingresar](${invite.code} 'Enlace de Ajedrez')**`) // Enlace clickeable con tooltip
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
                return interaction.editReply({ content: ' ', embeds: [interEmbed] }); // Reemplaza mensaje de carga
            }).catch(e => { // Manejo de errores
                if (e == 'Ha ocurrido un error al obtener los datos correspondientes.') {
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.unexpectedError', locale: language }) });
                } else if (e == 'Tu bot no cuenta con los permisos necesarios.') {
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.noInvitePerms', locale: language }) });
                };
            });
        } else { // Si NO seleccionó ilimitado (enlace temporal)
            createCodeChess(client, interaction.member.voice.channel.id, 'ID', 1800).then(invite => { // 1800 segundos = 30 minutos
                const interEmbed2 = new MessageEmbed()
                .setTimestamp()
                .setColor('GREEN')
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`**[Ingresa a jugar dando click aquí](${invite.code} 'Enlace de Ajedrez')**`)
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
                return interaction.editReply({ content: ' ', embeds: [interEmbed2] });
            }).catch(e => {
                // Mismo manejo de errores
            });
        };
    }
};

async function createCodeChess(client, voiceChannelId, applicationId, time) {
    let returnData = {}; // Objeto para retornar datos

    return new Promise((resolve, reject) => { // Promesa para manejar la creación
        fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, { // API de Discord para crear invitaciones
            method: 'POST',
            body: JSON.stringify({ // Cuerpo de la petición
                max_age: time, // Duración (0 = permanente)
                max_uses: 0, // Usos ilimitados
                target_application_id: applicationId, // ID de la aplicación (ajedrez)
                target_type: 2, // Tipo 2 = invitación a actividad
                temporary: false,
                validate: null
            }),
            headers: {
                'Authorization': `Bot ${client.token}`, // Token del bot
                'Content-Type': 'application/json'
            }
        }).then(res => res.json()) // Convierte respuesta a JSON
        .then(invite => {
            if (invite.error || !invite.code) reject('Ha ocurrido un error al obtener los datos correspondientes.'); // Si hay error
            if (invite.code === 50013 || invite.code === '50013') reject('Tu bot no cuenta con los permisos necesarios.'); // Permisos insuficientes
            
            returnData.code = `https://discord.com/invite/${invite.code}`; // URL completa de la invitación
            resolve(returnData); // Resuelve la promesa con el enlace
        }).catch(e => {
            console.log(e); // Log de error
        });
    });
};