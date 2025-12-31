module.exports = {
    name: 'guildCreate', // Nombre del evento: cuando el bot es añadido a un nuevo servidor
    async execute(guild) { // Función ejecutada cuando el bot entra a un nuevo servidor
        if (guild.memberCount > 500) {
            guild.channels.cache.get('ID').send({ content: `- Se ha añadido a un nuevo servidor: **${guild.name}**\n- Numero de usuarios: **${guild.memberCount}**` });
        }
        // Nota: Ambos casos envían al MISMO canal (ID: Tu ID de canal aquí)
        // El bot envía una notificación solo a servidores grandes (>500 miembros)
        // Servidores con menos de 500 miembros no generan notificación
    }
};