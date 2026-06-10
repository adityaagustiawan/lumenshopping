import { createOpenAICompatible } from "@ai-sdk/openai-compatible";

export function createLovableAiGatewayProvider(apiKey: string) {
  return createOpenAICompatible({
    name: "mimo",
    baseURL: "https://api.xiaomimimo.com/v1",
    headers: { 
      "Authorization": `Bearer ${apiKey}`,
    },
  });
}
