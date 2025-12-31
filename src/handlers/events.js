const fs = require('fs'); // Módulo para sistema de archivos
const categories = fs.readdirSync('./src/events'); // Lee carpetas de categorías de eventos

module.exports = (client) => { // Exporta función que recibe el cliente
    categories.forEach(async (category) => { // Itera sobre cada categoría de eventos
        fs.readdir(`./src/events/${category}`, (err) => { // Lee carpeta de categoría
            if (err) return console.error(err); // Maneja errores

            const eventFiles = fs.readdirSync(`./src/events/${category}`).filter((archivo) => archivo.endsWith('.js')); // Filtra archivos .js

            for (const file of eventFiles) { // Itera sobre cada archivo de evento
                const event = require(`../events/${category}/${file}`); // Importa el módulo del evento

                if (event.once) { // Si el evento tiene propiedad "once" (se ejecuta solo una vez)
                    client.once(event.name, (...args) => event.execute(client, ...args)); // Registra evento "once"
                } else { // Si es evento normal (se ejecuta cada vez)
                    client.on(event.name, (...args) => event.execute(client, ...args)); // Registra evento normal
                };
            };
        });
    });
};