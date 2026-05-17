
const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config({ path: './.env' });

const rawKeys = process.env.GEMINI_API_KEY || "";
const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 5);

async function testKeys() {
  console.log(`총 ${apiKeys.length}개의 키를 테스트합니다...\n`);
  
  for (let i = 0; i < apiKeys.length; i++) {
    const key = apiKeys[i];
    const maskedKey = key.substring(0, 8) + "..." + key.substring(key.length - 4);
    
    try {
      const genAI = new GoogleGenerativeAI(key);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Hi");
      const response = await result.response;
      console.log(`✅ [Key #${i+1}] ${maskedKey}: SUCCESS (${response.text().substring(0, 10)}...)`);
    } catch (err) {
      console.log(`❌ [Key #${i+1}] ${maskedKey}: FAILED (${err.message.substring(0, 50)}...)`);
    }
  }
}

testKeys();
