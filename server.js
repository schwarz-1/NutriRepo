require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(express.json());

// DeepSeek API Proxy Endpoint
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body;
    
    const response = await axios.post(
      'https://api.deepseek.com/v1/chat/completions',
      {
        model: "deepseek-chat",
        messages: [
          {
            role: "system",
            content: "You are a nutrition expert assistant. Provide helpful, accurate information about food, diets, and healthy eating."
          },
          {
            role: "user",
            content: message
          }
        ],
        temperature: 0.7
      },
      {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.DEEPSEEK_API_KEY}`
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (error) {
    console.error('DeepSeek API error:', error.response?.data || error.message);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});