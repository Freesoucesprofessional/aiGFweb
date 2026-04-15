const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

app.get('/api/chat', async (req, res) => {
  const prompt = req.query.prompt;
  
  if (!prompt) {
    return res.status(400).json({ error: 'Prompt is required' });
  }

  // Log incoming message
  console.log(`📥 [${new Date().toISOString()}] User said: "${prompt}"`);

  try {
    const response = await axios.get(
      `https://rajan-ki-ai-girlfriend-api.vercel.app/gf?prompt=${encodeURIComponent(prompt)}`,
      { timeout: 10000 }
    );

    let replyMessage = '';
    
    if (response.data && response.data.response) {
      replyMessage = response.data.response;
    } else if (response.data && response.data.message) {
      replyMessage = response.data.message;
    } else {
      const fallbackMessages = [
        "Haan baby, main sun rahi hoon! 🥰",
        "Acha? Phir batao kya ho raha hai 💕",
        "Tum bahut pyaare ho! 😘"
      ];
      replyMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    }
    
    // Log response
    console.log(`📤 [${new Date().toISOString()}] Muskan replied: "${replyMessage}"`);
    
    return res.json({ success: true, message: replyMessage });
    
  } catch (error) {
    const fallbackMessages = [
      "Haan baby, main sun rahi hoon! 🥰",
      "Mujhe tumse baat karke achha lagta hai 💕",
      "Main hamesha tumhari hoon 💫"
    ];
    const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
    
    // Log error and fallback
    console.error(`❌ [${new Date().toISOString()}] Error: ${error.message}`);
    console.log(`📤 [${new Date().toISOString()}] Fallback reply: "${randomMessage}"`);
    
    return res.json({ success: true, message: randomMessage, fallback: true });
  }
});

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'healthy' });
});

// This is the fix - using app.use instead of app.get('*')
app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`);
});