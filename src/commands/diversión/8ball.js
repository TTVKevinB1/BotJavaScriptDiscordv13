const { SlashCommandBuilder } = require('@discordjs/builders');
const { MessageEmbed } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('8ball') // Comando mágico
        .setDescription('Mandas una pregunta con respuesta automática del bot.')
        .addStringOption(option => option.setName('pregunta').setDescription('Escribe la pregunta que quieres realizar.').setRequired(true)), // Pregunta obligatoria
    async run(client, interaction, language) {
        const pregunta = interaction.options.getString('pregunta'); // Obtiene la pregunta

        let Respuestas = [ // Array de respuestas predefinidas (bilingüe)
            "En mi opinión, estaría bien | In my opinion, it would be fine.",
            "Eso es cierto | That's true.",
            "Posiblemente | Possibly.",
            // ... más respuestas
        ];

        const ball8Embed = new MessageEmbed()
        .setTimestamp()
        .setColor('RANDOM') // Color aleatorio
        .setAuthor(`${interaction.user.tag}`, interaction.user.displayAvatarURL({ dynamic: true, format: 'png' }))
        .setDescription(client.languages.__mf({ phrase: '8ball.pregunta', locale: language }, { pregunta: pregunta, respuesta: Respuestas[( Math.floor(Math.random() * Respuestas.length) )] })) // Respuesta aleatoria del array
        .setFooter(`${interaction.guild.name}`, interaction.guild.iconURL({ dynamic: true, format: 'png' }));
        return interaction.reply({ embeds: [ball8Embed] });
    }
};