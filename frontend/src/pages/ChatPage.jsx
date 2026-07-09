import { useState } from "react";
import { askQuestion } from "../services/chatService";
import "./ChatBot.css";

import Message from "./Message";
import Typing from "./Typing";

export default function ChatBot() {

  const [question, setQuestion] = useState("");

  const [loading, setLoading] = useState(false);

  const [messages, setMessages] = useState([
    {
      sender: "bot",
      text:
        "👋 Hello! I'm KnowForge AI.\nAsk me about machines, SOPs, repair steps, safety checklists, or uploaded company documents."
    }
  ]);

  const handleSend = async () => {

    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question
    };

    setMessages(prev => [...prev, userMessage]);

    setLoading(true);

    try {

      const result = await askQuestion(question);

      const botMessage = {
        sender: "bot",
        text: result.answer,
        source: result.source,
        ai: result.ai
      };

      setMessages(prev => [...prev, botMessage]);

    } catch {

      setMessages(prev => [

        ...prev,

        {

          sender: "bot",

          text: "Unable to connect to the KnowledgeForge server."

        }

      ]);

    }

    setLoading(false);

    setQuestion("");

  };

  return (

    <div className="chat-container">

      <div className="chat-header">

        <div>

          <h3>KnowForge AI</h3>

          <span>🟢 Company Knowledge Assistant</span>

        </div>

      </div>

      <div className="chat-body">

        {messages.map((msg, index) => (
    <Message
        key={index}
        sender={msg.sender}
        text={msg.text}
        source={msg.source}
        ai={msg.ai}
    />
))}

       {loading && <Typing />}
      </div>

      <div className="chat-footer">

        <input

          value={question}

          placeholder="Ask about CNC Machine..."

          onChange={(e)=>setQuestion(e.target.value)}

          onKeyDown={(e)=>{

            if(e.key==="Enter") handleSend();

          }}

        />

        <button onClick={handleSend}>

          Send

        </button>

      </div>

    </div>

  );

}