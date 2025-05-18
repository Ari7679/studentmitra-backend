const express = require("express");
const fetch = require("node-fetch");
const cors = require("cors");
require("dotenv").config(); // .env ফাইল থেকে KEY পড়বে

const app = express();
app.use(cors()); // Frontend থেকে request আসতে দিবে
app.use(express.json()); // JSON format handle করবে

// .env থেকে KEY গুলো নেবে
const apiKeys = process.env.API_KEYS.split(",");
let currentKeyIndex = 0;

function getNextApiKey() {
  const key = apiKeys[currentKeyIndex];
  currentKeyIndex = (currentKeyIndex + 1) % apiKeys.length;
  return key;
}

// API route: Frontend এখানে POST request পাঠাবে
app.post("/ask-ai", async (req, res) => {
  const prompt = req.body.prompt;
  const apiKey = getNextApiKey();

  const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

  try {
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }]
      })
    });

    const data = await response.json();
    const answer = data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "❌ কোনো উত্তর পাওয়া যায়নি।";
    res.json({ answer });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Server চালু হবে এই PORT-এ
app.listen(3000, () => {
  console.log("✅ Backend চলছে http://localhost:3000");
});
