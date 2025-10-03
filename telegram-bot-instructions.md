# Telegram Bot Setup Instructions

## Bot Configuration

**Bot Username:** `@majetechnologiesBot`
**Bot Token:** `8462359671:AAFCtL820wwOEUx1_yAElUOpp8A2F6gjEZg`
**Channel:** `@maje_projects`
**Contact Channel:** `@maje_contacts`

## /start Command Response

When users send `/start` to the bot, respond with:

---

🚀 **Welcome to MAJE Projects Bot!**

I help you submit projects to our "Our Work" portfolio section on the website. Here's how to add your projects:

## 📝 **Project Submission Formats**

### **Method 1: Text Message with Image URL**
```
#category Title | Description | Image URL | Project URL
```

### **Method 2: Photo with Caption**
Send a photo with this caption format:
```
#category Title | Description | Project URL
```

## 🏷️ **Available Categories**
- `#web-design` - Website designs and UI/UX
- `#web-development` - Full-stack web applications
- `#mobile-app` - iOS and Android applications
- `#graphic-design` - Logos, branding, print design
- `#ai-ml` - AI/ML solutions and automation
- `#automation` - Business process automation
- `#e-commerce` - Online stores and marketplaces
- `#cms` - Content management systems
- `#api` - API development and integration
- `#blockchain` - Blockchain and crypto projects

## ✅ **Examples**

**Web Design Example:**
```
#web-design Modern E-commerce Store | Responsive online store with payment integration and admin dashboard | https://example.com
```

**Mobile App Example (with photo):**
Send photo + caption:
```
#mobile-app Fitness Tracker | Cross-platform app with real-time tracking and social features | https://app-store-link.com
```

**AI/ML Project:**
```
#ai-ml Smart Chatbot | Intelligent customer service bot with NLP capabilities | https://demo.chatbot.com
```

## 📋 **Submission Guidelines**

✅ **Required Fields:**
- Category (must start with #)
- Project title
- Description (2-3 sentences)
- Project URL (live demo, GitHub, or app store link)

✅ **Image Requirements:**
- High quality (minimum 800x600px)
- Professional appearance
- Shows the actual project interface/design

✅ **Best Practices:**
- Use clear, descriptive titles
- Write compelling descriptions
- Include working project links
- Choose the most appropriate category

## 🔄 **What Happens Next**

1. Your project is automatically processed
2. Images are uploaded to Cloudinary
3. Data is stored in Firebase
4. Project appears on the website instantly
5. You'll receive a confirmation message

## 📞 **Need Help?**

If you have questions or need assistance, contact our team:
- Website: [Your Website URL]
- Email: [Your Email]
- WhatsApp: [Your WhatsApp Number]

**Ready to showcase your work? Send your first project using the format above!** 🎉

---

## Bot Implementation Notes

### Required Bot Commands:
- `/start` - Show welcome message and instructions
- `/help` - Show submission format help
- `/categories` - List all available categories
- `/examples` - Show example submissions

### Message Processing:
1. Parse incoming messages for project format
2. Validate category and required fields
3. Process images (upload to Cloudinary)
4. Store data in Firebase
5. Send confirmation to user
6. Update website in real-time

### Error Handling:
- Invalid format messages
- Missing required fields
- Image upload failures
- Database connection issues
- Provide helpful error messages with correction guidance