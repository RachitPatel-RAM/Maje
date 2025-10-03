const TelegramBot = require('node-telegram-bot-api');

// Your bot token
const BOT_TOKEN = '8462359671:AAFCtL820wwOEUx1_yAElUOpp8A2F6gjEZg';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

console.log('🤖 Bot started! Send any message to @majetechnologiesBot to get your User ID');
console.log('📱 Bot username: @majetechnologiesBot');
console.log('⏳ Waiting for messages...\n');

// Listen for any message
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const username = msg.from.username;
  const firstName = msg.from.first_name;
  const lastName = msg.from.last_name;

  console.log('📨 Message received!');
  console.log('👤 User Info:');
  console.log(`   User ID: ${userId}`);
  console.log(`   Username: @${username || 'N/A'}`);
  console.log(`   Name: ${firstName} ${lastName || ''}`.trim());
  console.log(`   Chat ID: ${chatId}`);
  console.log('');

  // Send response with user info
  const responseMessage = `
🎉 *Hello ${firstName}!*

Your Telegram User ID is: \`${userId}\`

This ID will be used to grant you admin access to the MaJe Technologies Project Manager Bot.

*Next Steps:*
1. Copy your User ID: \`${userId}\`
2. Add it to the bot's admin configuration
3. Restart the bot
4. Send /start to begin managing projects

*Bot Info:*
• Bot Username: @majetechnologiesBot
• Chat ID: ${chatId}
• Your Username: @${username || 'N/A'}
  `;

  bot.sendMessage(chatId, responseMessage, { parse_mode: 'Markdown' });
});

// Error handling
bot.on('error', (error) => {
  console.error('❌ Bot error:', error.message);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down bot...');
  bot.stopPolling();
  process.exit(0);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled rejection:', error);
});