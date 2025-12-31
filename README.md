# 🤖 Bot de Discord Multifuncional – Navidad 🎄

**Autor:** Kevin Bermúdez  
🎁 Regalo navideño y año nuevo para la comunidad

Bot de Discord desarrollado con **Discord.js v13**, con **moderación**, **actividades**, **estadísticas del sistema** y **soporte multilenguaje (ES / EN)**.

---

## ✨ Qué incluye

- 🌐 Idiomas: Español e Inglés  
- 🛡️ Moderación con logs  
- 🎮 Actividades en voz (YouTube, Poker, Chess, Betrayal)  
- 📊 Estado del bot (ping, CPU, RAM)  
- 🎉 Utilidades y diversión (avatar, 8ball, say)

---

## 📋 Requisitos

- Node.js **16+**
- MongoDB (Atlas recomendado)
- Cuenta de Discord Developer

---

## 🚀 Instalación Rápida

### 1️⃣ Clonar el proyecto

```bash
git clone https://github.com/tu-usuario/tu-bot.git
cd tu-bot
```

---

## 2️⃣ Configurar variables de entorno

- Crea el archivo .env:

```bash
TOKEN=TU_TOKEN_DEL_BOT
CLIENT_ID=TU_CLIENT_ID
MONGODB_URI=TU_MONGODB_URI
GUILD_ID=OPCIONAL_PARA_DESARROLLO
```

⚠️ Nunca subas este archivo a GitHub

---

## 3️⃣ Instalar dependencias

```bash
npm install
```

---

## 🔧 Configurar el Bot en Discord

- Ve a 👉 https://discord.com/developers/applications
- Crea una New Application
- En Bot → Add Bot
- Copia:
- TOKEN
- CLIENT ID
- Activar Intents (obligatorio)
- En Bot → Privileged Gateway Intents activa:
- ✅ Presence Intent
- ✅ Server Members Intent
- ✅ Message Content Intent
- 🔗 Invitar el bot a tu servidor

```bash
https://discord.com/api/oauth2/authorize?client_id=TU_CLIENT_ID&permissions=8&scope=bot%20applications.commands
```

---

## 🌐 Idiomas
- Los archivos de idioma están en:

```bash
locales/
├── es.json
└── en.json
```

- Puedes editar los textos o agregar más idiomas fácilmente.

---

## 🗄️ Base de Datos (MongoDB)
- Opción recomendada: MongoDB Atlas
- Crear cluster gratuito
- Crear usuario
- Permitir IP 0.0.0.0/0
- Copiar la URI en .env

---

## ▶️ Ejecutar el Bot
- Desarrollo

```bash
npm start
```

- Producción (opcional)

```bash
npm install -g pm2
pm2 start main.js --name discord-bot
```

---

## 🎯 Comandos Principales

### 🛡️ Administración

```bash
/setlang      Cambiar idioma
/setlogs      Canal de logs
/ban          Banear usuario
/kick         Expulsar usuario
/clear        Borrar mensajes
/lock         Bloquear canal
/unlock       Desbloquear canal
```

### 🎮 Actividades (voz)

```bash
/youtube
/poker
/chess
/betrayal
```

### 📊 Información

```bash
/help
/ping
/status
/userinfo
```

### 🎉 Diversión

```bash
/8ball
/say
/avatar
```

---

## 📁 Estructura del Proyecto

```bash
tu-bot/
├── main.js
├── package.json
├── .env
├── locales/
└── src/
```

---

## 🐛 Problemas Comunes

### ❌ El bot no responde
- Revisa el TOKEN
- Verifica intents
- Asegúrate de haberlo invitado

---

### ❌ Comandos no aparecen
- Espera unos minutos
- Reinicia el bot

---

## 🔒 Seguridad
- ❌ No subas .env
- ❌ No compartas tokens
- ✅ Usa permisos mínimos
- Añade a .gitignore:

```bash
.env
node_modules/
```

---

## 📄 Licencia

### 🎁 Uso libre.
- Puedes modificarlo y adaptarlo a tu proyecto.

# ✨ ¡Feliz Navidad, Feliz Año y feliz coding! ✨
- 📅 Diciembre 2023 · 🤖 Discord.js v13 · ⚡ Node.js 16+