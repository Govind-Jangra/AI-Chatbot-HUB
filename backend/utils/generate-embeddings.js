async function generateEmbedding(text) {
    const url = 'https://api.openai.com/v1/embeddings';
    try {
        const response = await axios.post(
            url,
            {
                model: 'text-embedding-3-large',
                input: text,
            },
            {
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );
        return response.data.data[0].embedding;
    } catch (error) {
        console.error('Error generating embedding:', error);
        throw error;
    }
}