const { SlashCommandBuilder } = require('@discordjs/builders'); // Constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Embeds para mensajes
const fetch = require('node-fetch'); // Para peticiones HTTP a la API de Discord

module.exports = {
    data: new SlashCommandBuilder() // Define comando slash
        .setName('youtube') // Nombre: youtube
        .setDescription('Crea una sesión de YouTube.') // Descripción
        .addBooleanOption(option => option.setName('ilimitado').setDescription('Activa la opción para que el enlace sea permanente y nunca finalice.')), // Opción para enlace permanente
    async run(client, interaction, language) { // Función ejecutada al usar comando
        await interaction.reply({ content: client.languages.__({ phrase: 'sesiones.ytloading', locale: language }) }); // Mensaje inicial "Cargando YouTube..."

        if (!interaction.member.voice.channel) { // Verifica si el usuario está en un canal de voz
            return interaction.editReply({ content: client.languages.__({ phrase: 'sesiones.nochannel', locale: language }) }); // Error si no está en canal de voz
        };

        if (interaction.options._hoistedOptions[0]?.value) { // Si usuario seleccionó "ilimitado: true"
            createCodeYT(client, interaction.member.voice.channel.id, 'ID', 0).then(invite => { // ID de YouTube Together, tiempo 0 = permanente
                const interEmbed = new MessageEmbed() // Crea embed para enlace permanente
                .setTimestamp() // Marca de tiempo
                .setColor('GREEN') // Color verde
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor con tag y avatar
                .setDescription(`**[Haz click aquí para ingresar](${invite.code} 'Enlace de YouTube')**`) // Enlace clickeable con tooltip
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Miniatura con avatar
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie del embed
                return interaction.editReply({ content: ' ', embeds: [interEmbed] }); // Reemplaza mensaje de carga
            }).catch(e => { // Manejo de errores
                if (e == 'Ha ocurrido un error al obtener los datos correspondientes.') { // Error de API
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.unexpectedError', locale: language }) }); // "Error inesperado"
                } else if (e == 'Tu bot no cuenta con los permisos necesarios.') { // Error de permisos
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.noInvitePerms', locale: language }) }); // "Sin permisos para crear invitaciones"
                };
            });
        } else { // Si NO seleccionó ilimitado (enlace temporal)
            createCodeYT(client, interaction.member.voice.channel.id, 'ID', 1800).then(invite => { // 1800 segundos = 30 minutos
                const interEmbed2 = new MessageEmbed() // Crea embed para enlace temporal
                .setTimestamp()
                .setColor('GREEN')
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`**[Ingresa a YouTube dando click aquí](${invite.code} 'Enlace de YouTube')**`) // Texto diferente
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
                return interaction.editReply({ content: ' ', embeds: [interEmbed2] }); // Reemplaza mensaje de carga
            }).catch(e => { // Mismo manejo de errores
                if (e == 'Ha ocurrido un error al obtener los datos correspondientes.') {
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.unexpectedError', locale: language }) });
                } else if (e == 'Tu bot no cuenta con los permisos necesarios.') {
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.noInvitePerms', locale: language }) });
                };
            });
        };
    }
};

async function createCodeYT(client, voiceChannelId, applicationId, time) { // Función para crear invitación de YouTube
    let returnData = {}; // Objeto para retornar datos

    return new Promise((resolve, reject) => { // Promesa para operación asíncrona
        fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, { // API de Discord para crear invitaciones
            method: 'POST', // Método POST
            body: JSON.stringify({ // Datos en JSON
                max_age: time, // Tiempo de expiración (segundos)
                max_uses: 0, // Usos ilimitados
                target_application_id: applicationId, // ID de YouTube Together
                target_type: 2, // Tipo 2 = actividad embebida
                temporary: false, // No temporal
                validate: null // Sin validación
            }),
            headers: { // Cabeceras
                'Authorization': `Bot ${client.token}`, // Token del bot
                'Content-Type': 'application/json' // Tipo de contenido
            }
        }).then(res => res.json()) // Convierte respuesta a JSON
        .then(invite => { // Procesa respuesta
            if (invite.error || !invite.code) reject('Ha ocurrido un error al obtener los datos correspondientes.'); // Si hay error
            if (invite.code === 50013 || invite.code === '50013') reject('Tu bot no cuenta con los permisos necesarios.'); // Error de permisos
            
            returnData.code = `https://discord.com/invite/${invite.code}`; // Construye URL completa
            resolve(returnData); // Resuelve promesa
        }).catch(e => { // Captura errores
            console.log(e); // Log en consola
        });
    });
};