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

  // Use a different key if the first one failed
  for (const apiKey of apiKeys.slice(0, 3)) {
      console.log(`\n--- Testing with key starting with ${apiKey.substring(0, 5)} ---`);
      const genAI = new GoogleGenerativeAI(apiKey);
      
      try {
        // Try to fetch via fetch API directly to see what's available
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
        const data = await response.json();
        
        if (data.models) {
            console.log("Available models:", data.models.map(m => m.name));
        } else {
            console.log("Response data:", data);
        }
      } catch (e) {
        console.error("Error fetching models:", e);
      }
  }
}

listModels();
