# MAJE Technologies Telegram Bot Setup

## Quick Start

1. **Install Node.js** (if not already installed)
   - Download from https://nodejs.org/

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Run the Bot**
   ```bash
   npm start
   ```
   
   Or for development with auto-restart:
   ```bash
   npm run dev
   ```

## Bot Information
- **Bot Username:** @majetechnologiesBot
- **Bot Token:** Already configured in the code
- **Commands:** `/start` - Welcome message and instructions

## Features
- Responds to `/start` command with welcome message
- Accepts project submissions via text or photo messages
- Handles different project categories
- Error handling and logging

## Files
- `telegram-bot-server.js` - Main bot server
- `package.json` - Dependencies and scripts
- `telegram-bot-instructions.md` - Detailed bot configuration

## Note
The bot server needs to be running for the `/start` command to work. The current website integration sends messages but doesn't handle bot commands - this server handles the bot's responses to users.