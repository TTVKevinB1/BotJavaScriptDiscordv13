const { SlashCommandBuilder } = require('@discordjs/builders'); // Importa constructor de comandos slash
const { MessageEmbed } = require('discord.js'); // Importa embeds para mensajes
const fetch = require('node-fetch'); // Para hacer peticiones HTTP a la API de Discord

module.exports = {
    data: new SlashCommandBuilder() // Define el comando slash
        .setName('betrayal') // Nombre del comando: betrayal
        .setDescription('Crea una sesión de Betrayal.') // Descripción
        .addBooleanOption(option => option.setName('ilimitado').setDescription('Activa la opción para que el enlace sea permanente y nunca finalice.')), // Opción booleana para enlace permanente
    async run(client, interaction, language) { // Función que se ejecuta al usar el comando
        await interaction.reply({ content: client.languages.__({ phrase: 'sesiones.betrayalloading', locale: language }) }); // Mensaje inicial "Cargando betrayal..."

        if (!interaction.member.voice.channel) { // Verifica si el usuario está en un canal de voz
            return interaction.editReply({ content: client.languages.__({ phrase: 'sesiones.nochannel', locale: language }) }); // Error si no está en un canal de voz
        };

        if (interaction.options._hoistedOptions[0]?.value) { // Si el usuario seleccionó "ilimitado: true"
            createCodeBetra(client, interaction.member.voice.channel.id, 'ID', 0).then(invite => { // ID de la aplicación de Betrayal.io, tiempo 0 = permanente
                const interEmbed = new MessageEmbed() // Crea embed para mostrar el enlace
                .setTimestamp() // Añade marca de tiempo
                .setColor('GREEN') // Color verde
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Autor con su tag y avatar
                .setDescription(`**[Haz click aquí para ingresar](${invite.code} 'Enlace de Betrayal')**`) // Enlace clickeable con tooltip
                .setThumbnail(interaction.user.displayAvatarURL({ dynamic: true, format: 'png' })) // Miniatura con avatar del usuario
                .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' })); // Pie con nombre e ícono del servidor
                return interaction.editReply({ content: ' ', embeds: [interEmbed] }); // Reemplaza mensaje de carga con el embed
            }).catch(e => { // Manejo de errores
                if (e == 'Ha ocurrido un error al obtener los datos correspondientes.') { // Error genérico de la API
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.unexpectedError', locale: language }) }); // "Error inesperado"
                } else if (e == 'Tu bot no cuenta con los permisos necesarios.') { // Error de permisos
                    return interaction.editReply({ content: client.languages.__({ phrase: 'utilies.noInvitePerms', locale: language }) }); // "No tienes permisos para crear invitaciones"
                };
            });
        } else { // Si el usuario NO seleccionó ilimitado (enlace temporal)
            createCodeBetra(client, interaction.member.voice.channel.id, 'ID', 1800).then(invite => { // 1800 segundos = 30 minutos
                const interEmbed2 = new MessageEmbed() // Crea embed para enlace temporal
                .setTimestamp()
                .setColor('GREEN')
                .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
                .setDescription(`**[Ingresa a jugar dando click aquí](${invite.code} 'Enlace de Betrayal')**`) // Texto diferente para enlace temporal
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

async function createCodeBetra(client, voiceChannelId, applicationId, time) { // Función para crear código de invitación
    let returnData = {}; // Objeto para retornar datos

    return new Promise((resolve, reject) => { // Promesa para manejar operación asíncrona
        fetch(`https://discord.com/api/v8/channels/${voiceChannelId}/invites`, { // Endpoint de la API de Discord para crear invitaciones
            method: 'POST', // Método POST para crear
            body: JSON.stringify({ // Datos en formato JSON
                max_age: time, // Tiempo de expiración en segundos (0 = nunca)
                max_uses: 0, // Número máximo de usos (0 = ilimitado)
                target_application_id: applicationId, // ID de la aplicación de Betrayal.io
                target_type: 2, // Tipo 2 = invitación a actividad/embedded application
                temporary: false, // No es temporal
                validate: null // Sin validación adicional
            }),
            headers: { // Cabeceras de la petición
                'Authorization': `Bot ${client.token}`, // Token de autenticación del bot
                'Content-Type': 'application/json' // Tipo de contenido
            }
        }).then(res => res.json()) // Convierte respuesta a JSON
        .then(invite => { // Procesa la respuesta
            if (invite.error || !invite.code) reject('Ha ocurrido un error al obtener los datos correspondientes.'); // Si hay error o no viene código
            if (invite.code === 50013 || invite.code === '50013') reject('Tu bot no cuenta con los permisos necesarios.'); // Error 50013 = permisos insuficientes
            
            returnData.code = `https://discord.com/invite/${invite.code}`; // Construye URL completa de la invitación
            resolve(returnData); // Resuelve la promesa con los datos
        }).catch(e => { // Captura errores de red o de fetch
            console.log(e); // Muestra error en consola
        });
    });
};