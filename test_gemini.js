const { GoogleGenerativeAI } = require('@google/generative-ai');
require('dotenv').config({ path: '.env.local' });

async function listModels() {
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  try {
    // There isn't a direct listModels in the simple genAI object in all SDK versions,
    // but we can try to test a few common ones.
    const models = ['gemini-1.5-pro-latest', 'gemini-1.5-flash-latest', 'gemini-pro', 'gemini-1.0-pro'];
    console.log('Testing models...');
    for (const modelName of models) {
      try {
        const model = genAI.getGenerativeModel({ model: modelName });
        await model.generateContent('test');
        console.log(`SUCCESS: ${modelName} works!`);
      } catch (e) {
        console.log(`FAILED: ${modelName} - ${e.message}`);
      }
    }
  } catch (error) {
    console.error('List models error:', error);
  }
}

listModels();
