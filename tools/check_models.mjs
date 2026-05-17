import { GoogleGenerativeAI } from "@google/generative-ai";
import dotenv from "dotenv";

dotenv.config();

async function listModels() {
  const rawKeys = process.env.GEMINI_TEXT_API_KEY || process.env.GEMINI_API_KEY || "";
  const apiKeys = rawKeys.split(",").map(k => k.trim()).filter(k => k.length > 5);
  
  if (apiKeys.length === 0) {
    console.error("No API keys found.");
    return;
  }

  const genAI = new GoogleGenerativeAI(apiKeys[0]);
  
  try {
    // Note: The SDK might not have a direct listModels method in all versions, 
    // but we can try to fetch it via a raw request if needed.
    // However, usually we can just try a very basic model like 'gemini-pro' (legacy) to see if it works.
    
    console.log("Checking available models...");
    // For now, let's just try to call gemini-1.5-flash explicitly with a tiny prompt
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await model.generateContent("hi");
    console.log("Response from gemini-1.5-flash:", result.response.text());
  } catch (e) {
    console.error("Error with gemini-1.5-flash:", e);
    
    try {
        console.log("Trying gemini-pro...");
        const model = genAI.getGenerativeModel({ model: "gemini-pro" });
        const result = await model.generateContent("hi");
        console.log("Response from gemini-pro:", result.response.text());
    } catch (e2) {
        console.error("Error with gemini-pro:", e2);
    }
  }
}

listModels();
