// OpenAI Configuration
import OpenAI from "openai";

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true, // Required for client-side usage
});

export default openai;

// Helper function for chat completions
export async function getChatCompletion(
  messages: OpenAI.Chat.ChatCompletionMessageParam[],
  model: string = "gpt-4o-mini"
) {
  const response = await openai.chat.completions.create({
    model,
    messages,
  });
  return response.choices[0].message.content;
}

// Helper function for simple prompts
export async function askAI(prompt: string, model: string = "gpt-4o-mini") {
  const response = await openai.chat.completions.create({
    model,
    messages: [{ role: "user", content: prompt }],
  });
  return response.choices[0].message.content;
}

