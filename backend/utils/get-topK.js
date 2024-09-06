import dotenv from "dotenv"
dotenv.config()

// Define the environment variables for base URLs in your environment configuration
const PINECONE_API_KEY = process.env.PINECONE_API_KEY 
const SALES_BASE_URL = process.env.SALES_BASE_URL 
const MOTIVATIONAL_BASE_URL = process.env.MOTIVATIONAL_BASE_URL
const NEGOTIATION_BASE_URL = process.env.NEGOTIATION_BASE_URL 
const REAL_ESTATE_BASE_URL = process.env.REAL_ESTATE_BASE_URL 

export async function getTopKResults(body, chatbot) {
  try {
    let baseUrl;

    // Assign the correct baseUrl based on the chatbot type
    switch (chatbot) {
      case "sales":
        baseUrl = SALES_BASE_URL;
        break;
      case "motivational":
        baseUrl = MOTIVATIONAL_BASE_URL;
        break;
      case "negotiation":
        baseUrl = NEGOTIATION_BASE_URL;
        break;
      case "realestate":
        baseUrl = REAL_ESTATE_BASE_URL;
        break;
      default:
        throw new Error("Invalid chatbot type");
    }

    // Make the API request to the Pinecone service
    const vectors = await fetch(`${baseUrl}/query`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json",
        "Api-Key": PINECONE_API_KEY
      },
      body: JSON.stringify(body)
    })
    .then(res => res.json())
    .then(data => {
      return data;
    });

    return vectors;
  } catch (error) {
    console.log(error);
    throw error;
  }
}
