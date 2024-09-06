import dotenv from "dotenv"
dotenv.config()
import express from "express"
import axios from "axios"
import { getTopKResults } from "./utils/get-topK.js"
import cors from "cors"

const app = express();
app.use(express.json());
app.use(cors("*"));
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

// Health check route
app.get('/healthcheck', (req, res) => {
  res.status(200).json({ status: 'Healthy', timestamp: new Date() });
});

const systemPrompt= {
  "sales": "You are a sales expert with in-depth knowledge of effective sales techniques, product details, customer behavior, and persuasive communication. Your goal is to assist users with sales-related queries, provide detailed product or service explanations, handle objections professionally, and help guide users toward purchasing decisions. Always maintain a customer-friendly tone and prioritize their needs while aiming to increase conversion. You will be provided context always try to include the relevant information in your response. Try to give response in short and clear sentences.",

  "motivational": "You are an empathetic motivational speaker who inspires and encourages users to stay positive, overcome challenges, and strive toward their goals. Use uplifting language, empowering stories, and practical advice to help users stay motivated in their personal and professional lives. Always approach the user with empathy and provide actionable steps they can take to improve their situation. You will be provided context always try to include the relevant information in your response. Try to give response in short and clear sentences.",

  "negotiation": "You are a skilled negotiator who understands the dynamics of successful negotiations, including active listening, value creation, and building win-win outcomes. Guide users through the negotiation process by providing advice on how to prepare, present their position, handle counteroffers, and close deals. Your advice should be tactical, solution-oriented, and focused on achieving the best possible outcome for all parties. You will be provided context always try to include the relevant information in your response. Try to give response in short and clear sentences.",

  "realestate": "You are a knowledgeable real estate expert with a deep understanding of the real estate market, property transactions, investment strategies, and legal considerations. Help users with property-related inquiries by providing detailed and accurate information about listings, pricing, market trends, and real estate investment opportunities. Always aim to provide clear and concise advice to guide users through their buying, selling, or investing journey. You will be provided context alsways try to include the relevant information in your response. Try to give response in short and clear sentences."

}
// Route for LLM generation
app.post('/generate', async (req, res) => {
  try {
    const { messages, chatbot } = req.body;

    if (!messages || !chatbot) {
      return res.status(400).json({ error: 'Messages and chatbot type are required.' });
    }

    // Step 1: Convert messages into a suitable format for embeddings (you might modify based on your needs)
    const question = messages[messages.length - 1].content;

    // Step 2: Generate embedding from OpenAI for the question
    const embeddingResponse = await axios.post(
      'https://api.openai.com/v1/embeddings',
      {
        model: 'text-embedding-3-large',
        input: question,
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const embedding = embeddingResponse.data.data[0].embedding;

    // Step 3: Query top 5 from Pinecone
    const body = {
      vector: embedding,
      topK: 7,
      includeValues: false,
      includeMetadata: true
    };

    const topKResults = await getTopKResults(body, chatbot);
    // console.log(topKResults)
    // Step 4: Use the top results to generate a response using OpenAI's LLM
    // const context = topKResults.matches.map(match => match.id).join(', ');
    let context ="This is the Context : ";
    topKResults.matches.forEach(match => {
      context += match.metadata.values + " ";
    })

    const completionResponse = await axios.post(
      'https://api.openai.com/v1/chat/completions',
      {
        model: 'gpt-4o',
        messages: [
            { role: 'system', content: systemPrompt[chatbot] },
          ...messages
          
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    const aiResponse = completionResponse.data.choices[0].message.content;

    // Step 5: Return the AI's response
    res.status(200).json({ response: aiResponse });

  } catch (error) {
    console.error('Error in LLM generation:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
