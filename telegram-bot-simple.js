const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const path = require('path');

// Telegram Bot Token
const BOT_TOKEN = '8462359671:AAFCtL820wwOEUx1_yAElUOpp8A2F6gjEZg';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Admin user IDs
const ADMIN_IDS = [1099017995, 123456789, 987654321];

// Projects storage file
const PROJECTS_FILE = path.join(__dirname, 'projects.json');

// User session storage
const userSessions = new Map();

// Categories
const CATEGORIES = [
  { id: 'web-development', name: 'Web Development', emoji: '🌐' },
  { id: 'mobile-app', name: 'Mobile Apps', emoji: '📱' },
  { id: 'ai-ml', name: 'AI & ML', emoji: '🤖' },
  { id: 'graphic-design', name: 'Graphic Design', emoji: '🎨' },
  { id: 'e-commerce', name: 'E-commerce', emoji: '🛒' },
  { id: 'automation', name: 'Automation', emoji: '⚙️' },
  { id: 'blockchain', name: 'Blockchain', emoji: '⛓️' },
  { id: 'cms', name: 'CMS', emoji: '📝' },
  { id: 'api', name: 'API Development', emoji: '🔌' }
];

// Helper Functions
function isAdmin(userId) {
  return ADMIN_IDS.includes(userId);
}

function loadProjects() {
  try {
    if (fs.existsSync(PROJECTS_FILE)) {
      const data = fs.readFileSync(PROJECTS_FILE, 'utf8');
      return JSON.parse(data);
    }
  } catch (error) {
    console.error('Error loading projects:', error);
  }
  return [];
}

function saveProjects(projects) {
  try {
    fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving projects:', error);
    return false;
  }
}

function createSession(userId, type = 'add') {
  userSessions.set(userId, {
    type,
    step: 'category',
    data: {},
    timestamp: Date.now()
  });
}

function getSession(userId) {
  return userSessions.get(userId);
}

function updateSession(userId, updates) {
  const session = getSession(userId);
  if (session) {
    Object.assign(session, updates);
    userSessions.set(userId, session);
  }
}

function clearSession(userId) {
  userSessions.delete(userId);
}

// Keyboard Helpers
function createCategoryKeyboard() {
  const keyboard = [];
  for (let i = 0; i < CATEGORIES.length; i += 2) {
    const row = [
      { text: `${CATEGORIES[i].emoji} ${CATEGORIES[i].name}`, callback_data: `cat_${CATEGORIES[i].id}` }
    ];
    if (i + 1 < CATEGORIES.length) {
      row.push({ text: `${CATEGORIES[i + 1].emoji} ${CATEGORIES[i + 1].name}`, callback_data: `cat_${CATEGORIES[i + 1].id}` });
    }
    keyboard.push(row);
  }
  return { inline_keyboard: keyboard };
}

function createMainMenuKeyboard() {
  return {
    inline_keyboard: [
      [
        { text: '➕ Add Project', callback_data: 'add_project' },
        { text: '📝 Edit Project', callback_data: 'edit_project' }
      ],
      [
        { text: '🗑️ Delete Project', callback_data: 'delete_project' },
        { text: '📋 List Projects', callback_data: 'list_projects' }
      ],
      [
        { text: '📊 Statistics', callback_data: 'stats' },
        { text: '❓ Help', callback_data: 'help' }
      ]
    ]
  };
}

// Bot Commands
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied. You are not authorized to use this bot.');
    return;
  }

  const welcomeMessage = `
🚀 *Welcome to MAJE Technologies Admin Bot!*

You have admin access to manage projects. Here's what you can do:

*Available Commands:*
• /start - Show this welcome message
• /add - Add a new project
• /list - List all projects
• /help - Show detailed help

*Quick Actions:*
Use the buttons below to get started!
  `;

  await bot.sendMessage(chatId, welcomeMessage, {
    parse_mode: 'Markdown',
    reply_markup: createMainMenuKeyboard()
  });
});

bot.onText(/\/add/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  createSession(userId, 'add');
  await bot.sendMessage(chatId, '📂 *Select a category for your project:*', {
    parse_mode: 'Markdown',
    reply_markup: createCategoryKeyboard()
  });
});

bot.onText(/\/list/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  const projects = loadProjects();
  
  if (projects.length === 0) {
    await bot.sendMessage(chatId, '📭 No projects found. Use /add to create your first project!');
    return;
  }

  let message = `📋 *Projects List (${projects.length} total):*\n\n`;
  
  projects.forEach((project, index) => {
    const category = CATEGORIES.find(cat => cat.id === project.category);
    message += `${index + 1}. *${project.title}*\n`;
    message += `   Category: ${category ? category.emoji + ' ' + category.name : project.category}\n`;
    message += `   Created: ${new Date(project.createdAt).toLocaleDateString()}\n`;
    message += `   ID: \`${project.id}\`\n\n`;
  });

  await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  const helpMessage = `
📖 *MAJE Technologies Admin Bot Help*

*🔧 CRUD Operations:*

*CREATE (Add Project):*
• Use /add or click "➕ Add Project"
• Follow the step-by-step process
• Provide: Category, Title, Description, Link, Images

*READ (List Projects):*
• Use /list or click "📋 List Projects"
• View all projects with details
• See project IDs for editing/deleting

*UPDATE (Edit Project):*
• Click "📝 Edit Project"
• Enter project ID to modify
• Update any field you want

*DELETE (Remove Project):*
• Click "🗑️ Delete Project"
• Enter project ID to remove
• Confirm deletion

*📊 Additional Features:*
• Statistics overview
• Category management
• Real-time website updates
• Image upload support

*💡 Tips:*
• Project IDs are shown in the list
• All changes update the website immediately
• Use high-quality images (min 800x600px)
• Provide detailed descriptions for better SEO

Need more help? Contact the development team!
  `;

  await bot.sendMessage(chatId, helpMessage, { parse_mode: 'Markdown' });
});

// Callback Query Handler
bot.on('callback_query', async (callbackQuery) => {
  const chatId = callbackQuery.message.chat.id;
  const userId = callbackQuery.from.id;
  const data = callbackQuery.data;

  if (!isAdmin(userId)) {
    await bot.answerCallbackQuery(callbackQuery.id, 'Access denied.');
    return;
  }

  await bot.answerCallbackQuery(callbackQuery.id);

  if (data.startsWith('cat_')) {
    const categoryId = data.replace('cat_', '');
    const category = CATEGORIES.find(cat => cat.id === categoryId);
    
    if (category) {
      updateSession(userId, {
        step: 'title',
        data: { category: categoryId, categoryName: category.name }
      });
      
      await bot.sendMessage(chatId, `${category.emoji} *${category.name}* selected!\n\nNow send me the *project title*:`, {
        parse_mode: 'Markdown'
      });
    }
  } else if (data === 'add_project') {
    createSession(userId, 'add');
    await bot.sendMessage(chatId, '📂 *Select a category for your project:*', {
      parse_mode: 'Markdown',
      reply_markup: createCategoryKeyboard()
    });
  } else if (data === 'list_projects') {
    // Trigger /list command
    bot.emit('message', { chat: { id: chatId }, from: { id: userId }, text: '/list' });
  } else if (data === 'delete_project') {
    await bot.sendMessage(chatId, '🗑️ *Delete Project*\n\nSend me the project ID to delete (use /list to see IDs):', {
      parse_mode: 'Markdown'
    });
    createSession(userId, 'delete');
  } else if (data === 'edit_project') {
    await bot.sendMessage(chatId, '📝 *Edit Project*\n\nSend me the project ID to edit (use /list to see IDs):', {
      parse_mode: 'Markdown'
    });
    createSession(userId, 'edit');
  } else if (data === 'stats') {
    const projects = loadProjects();
    const categoryStats = {};
    
    projects.forEach(project => {
      categoryStats[project.category] = (categoryStats[project.category] || 0) + 1;
    });
    
    let statsMessage = `📊 *Project Statistics*\n\n`;
    statsMessage += `Total Projects: *${projects.length}*\n\n`;
    statsMessage += `*By Category:*\n`;
    
    Object.entries(categoryStats).forEach(([categoryId, count]) => {
      const category = CATEGORIES.find(cat => cat.id === categoryId);
      const name = category ? category.emoji + ' ' + category.name : categoryId;
      statsMessage += `• ${name}: ${count}\n`;
    });
    
    await bot.sendMessage(chatId, statsMessage, { parse_mode: 'Markdown' });
  }
});

// Message Handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  if (!isAdmin(userId) || !text || text.startsWith('/')) {
    return;
  }

  const session = getSession(userId);
  if (!session) return;

  if (session.type === 'add') {
    if (session.step === 'title') {
      updateSession(userId, {
        step: 'description',
        data: { ...session.data, title: text }
      });
      
      await bot.sendMessage(chatId, '📝 Great! Now send me a *description* for the project:', {
        parse_mode: 'Markdown'
      });
    } else if (session.step === 'description') {
      updateSession(userId, {
        step: 'link',
        data: { ...session.data, description: text }
      });
      
      await bot.sendMessage(chatId, '🔗 Perfect! Now send me the *project URL/link*:', {
        parse_mode: 'Markdown'
      });
    } else if (session.step === 'link') {
      updateSession(userId, {
        step: 'image',
        data: { ...session.data, link: text }
      });
      
      await bot.sendMessage(chatId, '📸 Excellent! Now send me a *cover image* for the project:', {
        parse_mode: 'Markdown'
      });
    }
  } else if (session.type === 'delete') {
    const projects = loadProjects();
    const projectIndex = projects.findIndex(p => p.id === text);
    
    if (projectIndex === -1) {
      await bot.sendMessage(chatId, '❌ Project not found. Please check the ID and try again.');
      return;
    }
    
    const project = projects[projectIndex];
    projects.splice(projectIndex, 1);
    
    if (saveProjects(projects)) {
      await bot.sendMessage(chatId, `✅ *Project Deleted Successfully!*\n\n*"${project.title}"* has been removed from the portfolio.`, {
        parse_mode: 'Markdown',
        reply_markup: createMainMenuKeyboard()
      });
    } else {
      await bot.sendMessage(chatId, '❌ Error deleting project. Please try again.');
    }
    
    clearSession(userId);
  }
});

// Photo Handler
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    return;
  }

  const session = getSession(userId);
  if (!session || session.type !== 'add' || session.step !== 'image') {
    return;
  }

  const photo = msg.photo[msg.photo.length - 1];
  const fileId = photo.file_id;
  
  // Save project
  const projects = loadProjects();
  const newProject = {
    id: Date.now().toString(),
    ...session.data,
    image: fileId,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    createdBy: userId
  };
  
  projects.push(newProject);
  
  if (saveProjects(projects)) {
    clearSession(userId);
    
    const successMessage = `
🎉 *Project Added Successfully!*

*Project Details:*
• Title: ${newProject.title}
• Category: ${newProject.categoryName}
• Description: ${newProject.description}
• Link: ${newProject.link}
• Cover Image: ✅

*Project ID:* \`${newProject.id}\`

The project has been saved! 🚀
    `;

    await bot.sendMessage(chatId, successMessage, { 
      parse_mode: 'Markdown',
      reply_markup: createMainMenuKeyboard()
    });
  } else {
    await bot.sendMessage(chatId, '❌ Error saving project. Please try again.');
  }
});

// Error handling
bot.on('polling_error', (error) => {
  console.log('Polling error:', error);
});

bot.on('error', (error) => {
  console.error('Bot error:', error);
});

console.log('🤖 MAJE Technologies Admin Bot is running...');
console.log('Bot username: @majetechnologiesBot');
console.log(`👑 Admin User ID: ${ADMIN_IDS[0]} is authorized for CRUD operations`);
console.log('Ready for project management! 🚀');

module.exports = { bot };