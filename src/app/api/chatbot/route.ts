import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
});


// Define the shape of the request body
type ChatbotRequestBody = {
    userMessage: string;
};

// Define the handler function
export async function POST(
    req: NextRequest
): Promise<NextResponse> {
    try {
        // Parse the request body and ensure it's of type `ChatbotRequestBody`
        const { userMessage } = await req.json() as ChatbotRequestBody;

        // Validate the input
        if (!userMessage || typeof userMessage !== "string") {
            return NextResponse.json({ error: "Invalid input." }, { status: 400 });
        }

        // Communicate with OpenAI API
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo", 
            messages: [
                { role: "system", content: "You are a helpful IT support chatbot." },
                { role: "user", content: userMessage },
            ],
        });

        // Extract and send back the chatbot's reply
        const chatbotReply = response.choices[0].message?.content || "No response from AI.";
        return NextResponse.json({ message: chatbotReply }, { status: 200 });
    } catch (error) {
        console.error("Error communicating with OpenAI:", error);
        return NextResponse.json({ error: "Failed to fetch chatbot response." }, { status: 500 });
    }
}