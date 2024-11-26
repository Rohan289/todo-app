import { Todo } from "@/models/Todo";
import { TodoRepository } from "@/repositories/todoRepository";
import { initializeDb } from "@/typeorm/typeorm";
import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";

const openai = new OpenAI({
    apiKey: process.env.NEXT_OPENAI_API_KEY,
});


// Define the shape of the request body
type ChatbotRequestBody = {
    userMessage: string;
    user : string | null;
};

// Example function to create a ticket
async function createTicket(ticketDetails: Omit<Todo,'id'>){
     await TodoRepository.createTodo(ticketDetails);
}

// Define the handler function
export async function POST(
    req: NextRequest
): Promise<NextResponse> {
    await initializeDb();
    try {
        // Parse the request body and ensure it's of type `ChatbotRequestBody`
        const { userMessage,user } = await req.json() as ChatbotRequestBody;

        // Validate the input
        if (!userMessage || typeof userMessage !== "string") {
            return NextResponse.json({ error: "Invalid input." }, { status: 400 });
        }

        // Check if the user wants to create a ticket
        if (userMessage.toLowerCase().includes("create a ticket")) {
            if(!user){
                return NextResponse.json({ message: "User not logged in to create a ticket." }, { status: 200 });
            }
            // Extract ticket details (this is just a simple example)
            const details = userMessage.match(/create a ticket with title "(.*?)", description "(.*?)", and priority "(.*?)"/);
            if (details && details.length === 4) {
                const ticketDetails = {
                    title: details[1],
                    content: details[2],
                    priority: details[3],
                    assignedTo : JSON.parse(user),
                    createdAt: new Date(), // Current timestamp
                    updatedAt: new Date(), // Current timestamp
                };

                // Create the ticket
                await createTicket(ticketDetails);
                return NextResponse.json({ message: 'Ticket created successfully , check todo listing page.' }, { status: 200 });
            } else {
                return NextResponse.json({ message: "Please provide ticket details in the format: create a ticket with title \"Title\", description \"Description\", and priority \"Priority\"." }, { status: 200 });
            }
        }

        // Communicate with OpenAI API for general conversation
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