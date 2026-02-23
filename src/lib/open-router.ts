import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
    apiKey: process.env.OPENROUTER_API_KEY
});

export const generateText = async (prompt: string) => {
    const result = await openrouter.chat.send({
        chatGenerationParams: {
            model: "arcee-ai/trinity-mini:free",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
        },
    });
    
    return result.choices[0].message.content as string;
};

export const generateEmbedding = async (text: string) => {
    const embedding = await openrouter.embeddings.generate({
        requestBody: {
            model: "qwen/qwen3-embedding-8b",
            input: text,
            encodingFormat: "float",
            dimensions: 768,
        }
    });

    return (embedding as unknown as { data: { embedding: number[] }[] }).data[0].embedding;
};