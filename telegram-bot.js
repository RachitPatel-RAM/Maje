const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const multer = require('multer');
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

// Initialize Express app
const app = express();
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://your-project-id.firebaseio.com"
});

const db = admin.firestore();

// Telegram Bot Token
const BOT_TOKEN = '8462359671:AAFCtL820wwOEUx1_yAElUOpp8A2F6gjEZg';
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// Admin user IDs (replace with actual admin Telegram user IDs)
const ADMIN_IDS = [1099017995, 123456789, 987654321]; // Add your admin Telegram user IDs here

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
  keyboard.push([{ text: '➕ Add New Category', callback_data: 'cat_new' }]);
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
        { text: '📂 Manage Categories', callback_data: 'manage_categories' }
      ],
      [
        { text: '📊 View All Projects', callback_data: 'view_projects' },
        { text: '❌ Cancel', callback_data: 'cancel' }
      ]
    ]
  };
}

// Bot Commands
bot.onText(/\/start/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied. This bot is for authorized administrators only.');
    return;
  }

  const welcomeMessage = `
🚀 *Welcome to MaJe Technologies Project Manager Bot!*

This bot helps you manage the "Our Work" section on the website.

*Available Commands:*
• /start - Show this menu
• /add - Add a new project
• /edit - Edit existing project
• /delete - Delete a project
• /categories - Manage categories
• /projects - View all projects
• /help - Get detailed help

*Quick Actions:*
Choose an option below to get started:
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
  await bot.sendMessage(chatId, '📂 *Step 1: Select Category*\n\nChoose a category for your project:', {
    parse_mode: 'Markdown',
    reply_markup: createCategoryKeyboard()
  });
});

bot.onText(/\/projects/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  try {
    const projectsSnapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
    
    if (projectsSnapshot.empty) {
      await bot.sendMessage(chatId, '📭 No projects found.');
      return;
    }

    let message = '📊 *All Projects:*\n\n';
    projectsSnapshot.forEach((doc, index) => {
      const project = doc.data();
      const category = CATEGORIES.find(cat => cat.id === project.category);
      message += `${index + 1}. *${project.title}*\n`;
      message += `   Category: ${category ? category.emoji + ' ' + category.name : project.category}\n`;
      message += `   ID: \`${doc.id}\`\n\n`;
    });

    await bot.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  } catch (error) {
    console.error('Error fetching projects:', error);
    await bot.sendMessage(chatId, '❌ Error fetching projects. Please try again.');
  }
});

bot.onText(/\/help/, async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) {
    await bot.sendMessage(chatId, '❌ Access denied.');
    return;
  }

  const helpMessage = `
📖 *Detailed Help Guide*

*Adding a Project:*
1. Use /add or click "Add Project"
2. Select category (or create new one)
3. Enter project title
4. Enter project description
5. Provide project link (URL)
6. Upload cover image (recommended: 400x250px)
7. Optionally add more images

*Image Guidelines:*
• Cover image: 400x250px (16:10 ratio)
• Additional images: Same ratio preferred
• Formats: JPG, PNG, WebP
• Max size: 10MB per image

*Project Link:*
• Use full URLs (https://example.com)
• Can be website, app store link, demo, etc.

*Categories:*
Available categories include Web Development, Mobile Apps, AI & ML, Graphic Design, E-commerce, and more. You can also create custom categories.

*Editing/Deleting:*
• Use project ID from /projects command
• All fields can be updated
• Images can be replaced or added

*Tips:*
• Use descriptive titles and descriptions
• Ensure links are working before submitting
• High-quality images improve presentation
• Projects appear on website immediately after submission

Need more help? Contact the development team.
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

  if (data === 'cancel') {
    clearSession(userId);
    await bot.editMessageText('❌ Operation cancelled.', {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id
    });
    return;
  }

  if (data === 'add_project') {
    createSession(userId, 'add');
    await bot.editMessageText('📂 *Step 1: Select Category*\n\nChoose a category for your project:', {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      parse_mode: 'Markdown',
      reply_markup: createCategoryKeyboard()
    });
    return;
  }

  if (data.startsWith('cat_')) {
    const session = getSession(userId);
    if (!session) return;

    const categoryId = data.replace('cat_', '');
    
    if (categoryId === 'new') {
      updateSession(userId, { step: 'new_category' });
      await bot.editMessageText('➕ *Create New Category*\n\nEnter the name for the new category:', {
        chat_id: chatId,
        message_id: callbackQuery.message.message_id,
        parse_mode: 'Markdown'
      });
      return;
    }

    const category = CATEGORIES.find(cat => cat.id === categoryId);
    updateSession(userId, { 
      step: 'title',
      data: { category: categoryId, categoryName: category.name }
    });

    await bot.editMessageText(`✅ Category selected: *${category.emoji} ${category.name}*\n\n📝 *Step 2: Project Title*\n\nEnter the project title:`, {
      chat_id: chatId,
      message_id: callbackQuery.message.message_id,
      parse_mode: 'Markdown'
    });
  }
});

// Message Handler
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;
  const text = msg.text;

  if (!isAdmin(userId)) return;
  if (text && text.startsWith('/')) return; // Skip commands

  const session = getSession(userId);
  if (!session) return;

  try {
    switch (session.step) {
      case 'new_category':
        // Handle new category creation
        const newCategoryId = text.toLowerCase().replace(/[^a-z0-9]/g, '-');
        CATEGORIES.push({
          id: newCategoryId,
          name: text,
          emoji: '📁'
        });
        
        updateSession(userId, {
          step: 'title',
          data: { category: newCategoryId, categoryName: text }
        });

        await bot.sendMessage(chatId, `✅ New category created: *${text}*\n\n📝 *Step 2: Project Title*\n\nEnter the project title:`, {
          parse_mode: 'Markdown'
        });
        break;

      case 'title':
        updateSession(userId, {
          step: 'description',
          data: { ...session.data, title: text }
        });

        await bot.sendMessage(chatId, `✅ Title: *${text}*\n\n📄 *Step 3: Project Description*\n\nEnter a brief description of the project:`, {
          parse_mode: 'Markdown'
        });
        break;

      case 'description':
        updateSession(userId, {
          step: 'link',
          data: { ...session.data, description: text }
        });

        await bot.sendMessage(chatId, `✅ Description added\n\n🔗 *Step 4: Project Link*\n\nEnter the project URL (website, app store link, demo, etc.):`, {
          parse_mode: 'Markdown'
        });
        break;

      case 'link':
        // Validate URL
        try {
          new URL(text);
        } catch {
          await bot.sendMessage(chatId, '❌ Invalid URL format. Please enter a valid URL starting with http:// or https://');
          return;
        }

        updateSession(userId, {
          step: 'cover_image',
          data: { ...session.data, link: text }
        });

        await bot.sendMessage(chatId, `✅ Link added\n\n🖼️ *Step 5: Cover Image*\n\nUpload the main project image (recommended: 400x250px, 16:10 ratio):`, {
          parse_mode: 'Markdown'
        });
        break;

      case 'additional_images':
        if (text && text.toLowerCase() === 'done') {
          await saveProject(userId, chatId);
        } else {
          await bot.sendMessage(chatId, '📸 Send more images or type "done" to finish.');
        }
        break;
    }
  } catch (error) {
    console.error('Error handling message:', error);
    await bot.sendMessage(chatId, '❌ An error occurred. Please try again.');
  }
});

// Photo Handler
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  const userId = msg.from.id;

  if (!isAdmin(userId)) return;

  const session = getSession(userId);
  if (!session) return;

  try {
    const photo = msg.photo[msg.photo.length - 1]; // Get highest resolution
    const fileId = photo.file_id;
    
    // Get file info and download
    const file = await bot.getFile(fileId);
    const fileUrl = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

    if (session.step === 'cover_image') {
      updateSession(userId, {
        step: 'additional_images',
        data: { 
          ...session.data, 
          coverImage: fileUrl,
          additionalImages: []
        }
      });

      await bot.sendMessage(chatId, `✅ Cover image uploaded!\n\n📸 *Step 6: Additional Images (Optional)*\n\nSend more project images or type "done" to finish:`, {
        parse_mode: 'Markdown'
      });

    } else if (session.step === 'additional_images') {
      const currentImages = session.data.additionalImages || [];
      currentImages.push(fileUrl);
      
      updateSession(userId, {
        data: { ...session.data, additionalImages: currentImages }
      });

      await bot.sendMessage(chatId, `✅ Image ${currentImages.length + 1} added! Send more or type "done" to finish.`);
    }
  } catch (error) {
    console.error('Error handling photo:', error);
    await bot.sendMessage(chatId, '❌ Error processing image. Please try again.');
  }
});

// Save Project Function
async function saveProject(userId, chatId) {
  const session = getSession(userId);
  if (!session) return;

  try {
    const projectData = {
      ...session.data,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
      updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      createdBy: userId
    };

    const docRef = await db.collection('projects').add(projectData);
    
    clearSession(userId);

    const successMessage = `
🎉 *Project Added Successfully!*

*Project Details:*
• Title: ${projectData.title}
• Category: ${projectData.categoryName}
• Description: ${projectData.description}
• Link: ${projectData.link}
• Cover Image: ✅
• Additional Images: ${projectData.additionalImages?.length || 0}

*Project ID:* \`${docRef.id}\`

The project is now live on the website! 🚀
    `;

    await bot.sendMessage(chatId, successMessage, { 
      parse_mode: 'Markdown',
      reply_markup: createMainMenuKeyboard()
    });

    // Trigger website update (webhook or real-time update)
    await updateWebsite();

  } catch (error) {
    console.error('Error saving project:', error);
    await bot.sendMessage(chatId, '❌ Error saving project. Please try again.');
  }
}

// Website Update Function
async function updateWebsite() {
  try {
    // This function would trigger a website update
    // Could be a webhook, WebSocket, or direct database listener
    console.log('Website updated with new project');
  } catch (error) {
    console.error('Error updating website:', error);
  }
}

// API Endpoints for Website Integration
app.get('/api/projects', async (req, res) => {
  try {
    const projectsSnapshot = await db.collection('projects').orderBy('createdAt', 'desc').get();
    const projects = [];
    
    projectsSnapshot.forEach(doc => {
      projects.push({
        id: doc.id,
        ...doc.data()
      });
    });

    res.json(projects);
  } catch (error) {
    console.error('Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

app.get('/api/categories', (req, res) => {
  res.json(CATEGORIES);
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 Telegram Bot Server running on port ${PORT}`);
  console.log('📱 Bot is ready to receive commands!');
});

// Error handling
bot.on('error', (error) => {
  console.error('Bot error:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled rejection:', error);
});

module.exports = { bot, app };