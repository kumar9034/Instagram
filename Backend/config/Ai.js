 require('dotenv/config');
const { GoogleGenerativeAI } = require("@google/generative-ai");

const apiKey = 'AIzaSyCTn0tmWnhr24J7ib6qeZ_UF2ONvfV9ZGU';

if (!apiKey) {
  throw new Error("❌ GEMINI_API_KEY not found. Check your .env file");
}

const genAI = new GoogleGenerativeAI(apiKey);

async function run() {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const result = await model.generateContent("Hello Gemini! Say hi in one line.");
    console.log("✅ Response:", result.response.text());
  } catch (err) {
    console.error("❌ Error:", err);
  }
  
}

run();
