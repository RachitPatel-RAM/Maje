# 🤖 MaJe Technologies Telegram Bot Setup Guide

This guide will help you set up the comprehensive Telegram bot for managing your "Our Work" section.

## 📋 Prerequisites

1. **Node.js** (version 16 or higher)
2. **Firebase Project** with Firestore enabled
3. **Telegram Bot Token** from BotFather
4. **Admin Telegram User IDs**

## 🚀 Quick Setup

### Step 1: Create Telegram Bot

1. Open Telegram and search for `@BotFather`
2. Send `/newbot` command
3. Follow the prompts to create your bot
4. Save the **Bot Token** (looks like: `123456789:ABCdefGHIjklMNOpqrsTUVwxyz`)

### Step 2: Get Your Telegram User ID

1. Search for `@userinfobot` on Telegram
2. Send `/start` to get your User ID
3. Save this number (you'll need it for admin access)

### Step 3: Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or use existing one
3. Enable **Firestore Database**
4. Go to Project Settings → Service Accounts
5. Generate a new private key (downloads a JSON file)
6. Save this file as `firebase-service-account.json` in your project root

### Step 4: Install Dependencies

```bash
npm install
```

### Step 5: Configure Environment

1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` file with your credentials:
   ```env
   BOT_TOKEN=your_bot_token_here
   ADMIN_IDS=your_telegram_user_id
   ```

### Step 6: Update Bot Configuration

Edit `telegram-bot.js` and update these lines:

```javascript
// Line 15: Replace with your bot token
const BOT_TOKEN = process.env.BOT_TOKEN || 'YOUR_BOT_TOKEN_HERE';

// Line 18: Add your Telegram User ID
const ADMIN_IDS = [YOUR_USER_ID_HERE]; // Replace with your actual user ID

// Line 8: Update Firebase config
const serviceAccount = require('./firebase-service-account.json');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://YOUR_PROJECT_ID.firebaseio.com" // Replace with your project ID
});
```

### Step 7: Start the Bot

```bash
npm start
```

## 🎯 Bot Commands

### Admin Commands

- `/start` - Show main menu
- `/add` - Add a new project
- `/edit` - Edit existing project  
- `/delete` - Delete a project
- `/categories` - Manage categories
- `/projects` - View all projects
- `/help` - Get detailed help

### Adding a Project Flow

1. **Select Category**: Choose from existing categories or create new one
2. **Project Title**: Enter the project name
3. **Description**: Brief project description
4. **Project Link**: Website, app store link, or demo URL
5. **Cover Image**: Upload main project image (recommended: 400x250px)
6. **Additional Images**: Upload more project images (optional)

## 📸 Image Guidelines

- **Cover Image**: 400x250px (16:10 ratio) for optimal display
- **Additional Images**: Same ratio preferred
- **Formats**: JPG, PNG, WebP supported
- **Max Size**: 10MB per image
- **Quality**: High-resolution images recommended

## 🔧 Website Integration

The bot automatically updates your website through:

1. **Firebase Firestore**: Projects stored in real-time database
2. **API Endpoints**: 
   - `GET /api/projects` - Fetch all projects
   - `GET /api/categories` - Fetch categories
3. **Real-time Updates**: Website updates immediately when projects are added

### Update Website JavaScript

Add this to your website's JavaScript to load projects dynamically:

```javascript
// Load projects from Firebase/API
async function loadProjectsFromFirebase() {
  try {
    const response = await fetch('/api/projects');
    const projects = await response.json();
    
    // Clear existing projects
    const projectsGrid = document.querySelector('.projects-grid');
    projectsGrid.innerHTML = '';
    
    // Add projects to grid
    projects.forEach(project => {
      addProjectToGrid(project);
    });
    
    // Hide loading message
    document.querySelector('.loading-message').style.display = 'none';
  } catch (error) {
    console.error('Error loading projects:', error);
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadProjectsFromFirebase);
```

## 🛡️ Security Features

- **Admin-only Access**: Only authorized users can manage projects
- **Input Validation**: All inputs are validated before saving
- **Error Handling**: Comprehensive error handling and user feedback
- **Session Management**: Secure session handling for multi-step flows

## 🔍 Troubleshooting

### Common Issues

1. **Bot not responding**:
   - Check bot token is correct
   - Ensure bot is started with `/start` command
   - Verify your user ID is in ADMIN_IDS array

2. **Firebase errors**:
   - Check service account JSON file is correct
   - Verify Firestore is enabled in Firebase console
   - Ensure database URL is correct

3. **Image upload issues**:
   - Check image size (max 10MB)
   - Verify image format (JPG, PNG, WebP)
   - Ensure stable internet connection

4. **Website not updating**:
   - Check API endpoints are accessible
   - Verify Firebase connection
   - Check browser console for errors

### Debug Mode

Enable debug logging by adding to your `.env`:
```env
NODE_ENV=development
DEBUG=true
```

## 📞 Support

For technical support or questions:
- Check the troubleshooting section above
- Review bot logs for error messages
- Contact the development team

## 🔄 Updates

To update the bot:
1. Pull latest changes
2. Run `npm install` for new dependencies
3. Restart the bot: `npm start`

---

**🎉 Your Telegram bot is now ready to manage your project portfolio!**

Send `/start` to your bot to begin adding projects to your website.