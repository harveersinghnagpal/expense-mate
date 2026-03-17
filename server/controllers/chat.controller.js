const { Groq } = require('groq-sdk');
const Transaction = require('../models/Transaction');
const Category = require('../models/Category');

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

const getChatResponse = async (req, res) => {
  const { message } = req.body;
  const userId = req.user.id;
  console.log('Chat Request Received for User:', userId, 'Message:', message);

  try {
    console.log('Fetching RAG context from DB...');
    const transactions = await Transaction.find({ userId })
      .sort({ date: -1 })
      .limit(50)
      .populate('categoryId', 'name');

    console.log(`RAG: Found ${transactions.length} transactions for context.`);

    const context = transactions.map(t => ({
      date: t.date.toDateString(),
      type: t.type,
      amount: t.amount,
      category: t.categoryId ? t.categoryId.name : 'Uncategorized',
      note: t.note || ''
    }));

    // 2. Construct Prompt for LLM
    const systemPrompt = `
      You are "ExpenseMate", a helpful and intelligent financial assistant. 
      You have access to the user's transaction history. 
      Analyze the user's expenses and income to provide accurate, concise, and helpful answers.
      
      User's Recent Transactions (Context):
      ${JSON.stringify(context, null, 2)}
      
      Instructions:
      - Be conversational but professional.
      - If requested, summarize spending, identify trends, or suggest budget improvements.
      - If you don't know the answer or it's not in the context, be honest.
      - Keep responses relatively brief (max 3-4 sentences unless a detailed breakdown is requested).
    `;

    // 3. Call Groq LLM
    console.log('Sending request to Groq...');
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: message }
      ],
      model: 'llama-3.1-8b-instant', // Very stable and fast model
      temperature: 0.5,
      max_tokens: 500,
    });

    const aiResponse = chatCompletion.choices[0]?.message?.content || "I'm sorry, I couldn't generate a response.";
    console.log('Groq Response Received.');

    res.json({ response: aiResponse });
  } catch (error) {
    console.error('Detailed Chat Error:', {
      message: error.message,
      stack: error.stack,
      response: error.response?.data
    });
    res.status(500).json({ message: 'Error processing your request', error: error.message });
  }
};

module.exports = { getChatResponse };
