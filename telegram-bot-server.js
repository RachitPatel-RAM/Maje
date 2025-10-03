const TelegramBot = require('node-telegram-bot-api');

// Bot configuration
const BOT_TOKEN = '8462359671:AAFCtL820wwOEUx1_yAElUOpp8A2F6gjEZg';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Start command handler
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  
  const welcomeMessage = `🚀 **Welcome to MAJE Technologies Bot!**

I help you submit projects to our "Our Work" portfolio section on the website. Here's how to add your projects:

## 📝 **Project Submission Formats**

### **Method 1: Text Message with Image URL**
\`\`\`
#category Title | Description | Image URL | Project URL
\`\`\`

### **Method 2: Photo with Caption**
Send a photo with this caption format:
\`\`\`
#category Title | Description | Project URL
\`\`\`

## 🏷️ **Available Categories**
• \`#web-design\` - Website designs and UI/UX
• \`#web-development\` - Full-stack web applications
• \`#mobile-app\` - iOS and Android applications
• \`#graphic-design\` - Logos, branding, print design
• \`#ai-ml\` - AI/ML solutions and automation
• \`#automation\` - Business process automation
• \`#e-commerce\` - Online stores and marketplaces
• \`#cms\` - Content management systems
• \`#api\` - API development and integration
• \`#blockchain\` - Blockchain and crypto projects

## ✅ **Examples**

**Web Design Example:**
\`\`\`
#web-design Modern E-commerce Store | Responsive online store with payment integration and admin dashboard | https://example.com/image.jpg | https://example.com
\`\`\`

**Mobile App Example:**
\`\`\`
#mobile-app Food Delivery App | Cross-platform mobile app with real-time tracking | https://play.google.com/store/apps/details?id=com.example
\`\`\`

## 📋 **Submission Guidelines**
• Use clear, descriptive titles
• Provide detailed descriptions
• Include working project URLs when possible
• Use high-quality images (min 800x600px)
• Choose the most appropriate category

## 🔄 **What Happens Next?**
1. Your submission is automatically processed
2. Projects are reviewed for quality
3. Approved projects appear on our website
4. You'll receive confirmation once published

## 📞 **Need Help?**
Contact us at: contact@majetechnologies.com
Website: https://majetechnologies.com

Ready to showcase your work? Send your first project! 🚀`;

  bot.sendMessage(chatId, welcomeMessage, { parse_mode: 'Markdown' });
});

// Handle text messages (project submissions)
bot.on('message', (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  
  // Skip if it's a command
  if (text && text.startsWith('/')) {
    return;
  }
  
  // Handle project submissions
  if (text && text.includes('#') && text.includes('|')) {
    // Process project submission
    const confirmationMessage = `✅ **Project Submission Received!**

Thank you for your submission. Your project has been received and will be reviewed by our team.

📋 **What's Next?**
• Our team will review your submission
• Quality check and formatting
• Publication on our website
• You'll receive confirmation once live

⏱️ **Processing Time:** 1-2 business days

Need to submit another project? Just send it using the same format! 🚀`;

    bot.sendMessage(chatId, confirmationMessage, { parse_mode: 'Markdown' });
  }
});

// Handle photo messages
bot.on('photo', (msg) => {
  const chatId = msg.chat.id;
  const caption = msg.caption;
  
  if (caption && caption.includes('#') && caption.includes('|')) {
    // Process photo submission
    const confirmationMessage = `✅ **Photo Project Submission Received!**

Thank you for your submission with image. Your project has been received and will be reviewed by our team.

📋 **What's Next?**
• Image processing and optimization
• Content review and quality check
• Publication on our website
• Confirmation once live

⏱️ **Processing Time:** 1-2 business days

Keep the great work coming! 📸🚀`;

    bot.sendMessage(chatId, confirmationMessage, { parse_mode: 'Markdown' });
  } else {
    bot.sendMessage(chatId, `📸 **Photo received!** 

To submit this as a project, please add a caption in this format:
\`\`\`
#category Title | Description | Project URL
\`\`\`

Example:
\`\`\`
#web-design Modern Portfolio | Clean and responsive portfolio website | https://example.com
\`\`\``, { parse_mode: 'Markdown' });
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

console.log('🤖 MAJE Technologies Bot is running...');
console.log('Bot username: @majetechnologiesBot');
console.log('Ready to receive project submissions!');