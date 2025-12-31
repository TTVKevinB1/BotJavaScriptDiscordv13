const executeCommand = require('../../functions/executeCommand.js'); // Importa función que ejecuta comandos

module.exports = {
    name: 'interactionCreate', // Nombre del evento: cuando se crea una interacción (comando slash, botón, etc.)
    async execute(client, interaction) { // Función ejecutada cuando ocurre el evento
        if (interaction.isCommand()) executeCommand(client, interaction); // Si la interacción es un comando slash, ejecuta la función
        // Nota: Solo maneja comandos slash, ignora botones, menús desplegables, etc.
    }
};