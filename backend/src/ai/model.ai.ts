import { ChatGroq } from "@langchain/groq";
import { ChatCohere } from "@langchain/cohere";
import config from "../config/config.js";

// Registry of available models with display names
export const MODEL_REGISTRY: Record<string, { name: string; provider: string }> = {
    "groq:openai/gpt-oss-20b": { name: "GPT-OSS 20B (Groq)", provider: "groq" },
    "groq:qwen/qwen3.8-27b": { name: "Qwen 3.8 27B (Groq)", provider: "groq" },
    "cohere:command-a-03-2025": { name: "Command A (Cohere)", provider: "cohere" },
};

export function getModel(modelId: string) {
    const entry = MODEL_REGISTRY[modelId];
    if (!entry) throw new Error(`Unknown model: ${modelId}`);

    const [provider, ...rest] = modelId.split(":");
    const model = rest.join(":");

    switch (provider) {
        case "groq":
            return new ChatGroq({ model: model as any, apiKey: config.GROQ_API_KEY });
        case "cohere":
            return new ChatCohere({ model: model as any, apiKey: config.COHERE_API_KEY });
        default:
            throw new Error(`Unknown provider: ${provider}`);
    }
}

// Default judge model (Cohere)
export const judgeModel = new ChatCohere({
    model: "command-a-03-2025",
    apiKey: config.COHERE_API_KEY,
});