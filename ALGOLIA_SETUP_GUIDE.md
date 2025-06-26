# 🔍 Algolia Setup Guide

This guide will help you set up Algolia search for your AI Recipe Planner app with sample recipe data.

## 📋 Prerequisites

1. **Algolia Account**: Sign up for a free account at [algolia.com](https://www.algolia.com/)
2. **Node.js**: Make sure you have Node.js installed

## 🔧 Step-by-Step Setup

### Step 1: Get Your Algolia Credentials

1. **Sign up** for Algolia at [algolia.com](https://www.algolia.com/)
2. **Go to your dashboard** after creating your account
3. **Copy these credentials**:
   - **Application ID** (found in the dashboard overview)
   - **Admin API Key** (found in API Keys section - has write permissions)
   - **Search-Only API Key** (found in API Keys section - for frontend use)

### Step 2: Create Your Environment File

1. **Copy the template**:
   ```bash
   copy .env.template .env
   ```

2. **Edit your `.env` file** with your actual credentials:
   ```env
   # Algolia Configuration
   VITE_ALGOLIA_APP_ID=your_actual_app_id_here
   VITE_ALGOLIA_SEARCH_KEY=your_actual_search_key_here
   ALGOLIA_ADMIN_KEY=your_actual_admin_key_here
   VITE_ALGOLIA_INDEX_NAME=recipes
   
   # Optional: Gemini API Configuration
   VITE_GEMINI_API_KEY=your_gemini_api_key_here
   ```

   ⚠️ **Important**: 
   - `VITE_ALGOLIA_SEARCH_KEY` = Search-Only API Key (for frontend)
   - `ALGOLIA_ADMIN_KEY` = Admin API Key (for setup script only)

### Step 3: Run the Setup Script

The setup script will create your index and populate it with 6 sample recipes:

```bash
npm run setup-algolia
```

You should see output like:
```
🔄 Setting up Algolia index...
✅ Successfully uploaded sample recipes to Algolia!
📊 Added 6 recipes to index: recipes
🎯 Task ID: 12345
⏳ Waiting for indexing to complete...
🎉 Algolia setup complete!
🔍 You can now search for recipes in your app
```

### Step 4: Restart Your Development Server

```bash
npm run dev
```

## 🍳 Sample Recipes Included

The setup script includes these delicious recipes:

1. **Classic Spaghetti Carbonara** (Italian)
2. **Vegan Buddha Bowl** (Healthy, Vegan, Gluten-Free)  
3. **Chicken Stir Fry** (Asian, High-Protein)
4. **Chocolate Chip Cookies** (Dessert, Vegetarian)
5. **Greek Salad** (Salad, Vegetarian, Gluten-Free)
6. **Beef Tacos** (Mexican, High-Protein)

## 🔍 Testing Your Search

1. **Open your app** at http://localhost:5173
2. **Go to any page with search** (like the Cookbook page)
3. **Try searching for**:
   - "pasta" → Should find Carbonara
   - "vegan" → Should find Buddha Bowl  
   - "chicken" → Should find Stir Fry
   - "cookies" → Should find Chocolate Chip Cookies

## 🛠️ Troubleshooting

### Common Issues:

1. **"Missing Algolia credentials" error**:
   - Make sure your `.env` file exists and has the correct keys
   - Check that you copied the values correctly from Algolia dashboard

2. **"Network error" or "Unauthorized" error**:
   - Verify your API keys are correct
   - Make sure you're using the Admin API Key for the setup script
   - Check that your Application ID is correct

3. **Search not working in the app**:
   - Make sure you restarted your dev server after adding the `.env` file
   - Check the browser console for error messages
   - Verify the search-only key is correct in your `.env`

### Debug Mode:

Check your browser console when using the app. You should see:
- ✅ `Algolia client initialized successfully`
- ❌ If you see warnings, check your credentials

## 🔒 Security Notes

- **Never commit your `.env` file** to version control
- **Use Search-Only API Key** in your frontend (already configured)
- **Keep Admin API Key secure** (only needed for setup)

## 📊 Managing Your Index

You can view and manage your recipes in the [Algolia Dashboard](https://www.algolia.com/apps):

1. Go to your dashboard
2. Select your application
3. Click on "Search" → "Index"
4. You'll see your "recipes" index with all the data

## 🎯 Next Steps

Once Algolia is working:

1. **Add more recipes** by running the setup script again with additional data
2. **Customize search settings** in the Algolia dashboard
3. **Add filters** for dietary requirements, cooking time, etc.
4. **Connect to Gemini AI** to generate new recipes that get added to Algolia

## 🆘 Need Help?

If you run into issues:

1. **Check the console** for error messages
2. **Verify your credentials** in the Algolia dashboard
3. **Try the setup script again** if indexing failed
4. **Ask for help** - I'm here to assist!

---

**Happy cooking! 👨‍🍳👩‍🍳** 