'use client';
import { useState } from "react";
import styles from "./Chatbot.module.css"; // Import the CSS module

type Message = {
    role: "user" | "assistant";
    content: string;
};

const Chatbot = () => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [input, setInput] = useState<string>("");
    const [isOpen, setIsOpen] = useState<boolean>(false); // State to toggle chatbot visibility

    const sendMessage = async () => {
        const userMessage: Message = { role: "user", content: input };
        setMessages([...messages, userMessage]);

        try {
            const response = await fetch("/api/chatbot", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userMessage: input }),
            });

            if (!response.ok) {
                throw new Error("Failed to fetch chatbot response.");
            }

            const data: { message: string } = await response.json();
            const botMessage: Message = { role: "assistant", content: data.message };
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }

        setInput("");
    };

    return (
        <div className={styles.chatbotWrapper}>
            <button
                className={styles.toggleButton}
                onClick={() => setIsOpen(!isOpen)}
            >
                {isOpen ? "Close Chat" : "Chat"}
            </button>
            {isOpen && (
                <div className={styles.chatbotContainer}>
                    <div className={styles.messages}>
                        {messages.map((msg, index) => (
                            <div key={index} className={styles[msg.role]}>
                                {msg.content}
                            </div>
                        ))}
                    </div>
                    <div className={styles.inputArea}>
                        <input
                            type="text"
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Type your message..."
                            className={styles.input}
                        />
                        <button onClick={sendMessage} className={styles.sendButton}>
                            Send
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Chatbot;
