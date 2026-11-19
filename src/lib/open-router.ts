import { env } from "@/lib/env";
import { OpenRouter } from "@openrouter/sdk";

const openrouter = new OpenRouter({
    apiKey: env.OPENROUTER_API_KEY
});

export const generateText = async (prompt: string) => {
    const result = await openrouter.chat.send({
        chatGenerationParams: {
            model: env.OPENROUTER_TEXT_MODEL_ID,
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
            model: env.OPENROUTER_EMBEDDING_MODEL_ID,
            input: text,
            encodingFormat: "float",
            dimensions: 768,
        }
    });

    return (embedding as unknown as { data: { embedding: number[] }[] }).data[0].embedding;
};