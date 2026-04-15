const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

async function send() {
  const text = inp.value.trim();
  if (!text) return;

  // Log user message to console
  console.log(`💬 User [${new Date().toLocaleTimeString()}]: ${text}`);

  inp.value = '';
  inp.style.height = 'auto';
  btn.disabled = true;
  
  addMsg(text, 'me');
  showTyping();

  try {
    const response = await fetch(`/api/chat?prompt=${encodeURIComponent(text)}`);
    const data = await response.json();
    
    hideTyping();
    
    if (data.success && data.message) {
      // Log AI response to console
      console.log(`🤖 Muskan [${new Date().toLocaleTimeString()}]: ${data.message}`);
      addMsg(data.message, 'her');
    } else {
      console.log(`⚠️ No message in response data`);
      addMsg("Kuch gadbad hui, phir se bolo na 🥺", 'her');
    }
    
  } catch (error) {
    hideTyping();
    console.error('❌ Network Error:', error);
    addMsg("Network error - thodi der baad try karo 💕", 'her');
  } finally {
    btn.disabled = false;
    inp.focus();
  }
}

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