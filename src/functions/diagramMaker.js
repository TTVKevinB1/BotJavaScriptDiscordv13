module.exports = (used, free) => { // Exporta función que recibe "usado" y "libre"
    const full = '▰'; // Carácter Unicode para barra llena
    const empty = '▱'; // Carácter Unicode para barra vacía

    const total = used + free; // Calcula total (usado + libre)

    used = Math.round((used / total) * 10); // Convierte "usado" a porcentaje y escala a 10 caracteres
    free = Math.round((free / total) * 10); // Convierte "libre" a porcentaje y escala a 10 caracteres

    return full.repeat(used) + empty.repeat(free); // Retorna cadena con barras visuales
    // Ejemplo: used=70, free=30 → "▰▰▰▰▰▰▰▱▱▱" (7 llenas, 3 vacías)
}