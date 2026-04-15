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

  try {
    const response = await axios.get(
      `https://rajan-ki-ai-girlfriend-api.vercel.app/gf?prompt=${encodeURIComponent(prompt)}`,
      { timeout: 10000 }
    );

    if (response.data && response.data.response) {
      return res.json({ success: true, message: response.data.response });
    } else if (response.data && response.data.message) {
      return res.json({ success: true, message: response.data.message });
    } else {
      const fallbackMessages = [
        "Haan baby, main sun rahi hoon! 🥰",
        "Acha? Phir batao kya ho raha hai 💕",
        "Tum bahut pyaare ho! 😘"
      ];
      const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
      return res.json({ success: true, message: randomMessage, fallback: true });
    }
    
  } catch (error) {
    const fallbackMessages = [
      "Haan baby, main sun rahi hoon! 🥰",
      "Mujhe tumse baat karke achha lagta hai 💕",
      "Main hamesha tumhari hoon 💫"
    ];
    const randomMessage = fallbackMessages[Math.floor(Math.random() * fallbackMessages.length)];
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