import { useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { useAuth } from "../contexts/AuthContext";
import { askAI } from "../services/aiAssistant";

import "../styles/aiChat.css";

function AIChat() {
  const { user, role } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: `
        <h3>🤖 Welcome to KnowForge AI</h3>

        <p>
          I can help you search your company's industrial knowledge.
        </p>

        <p>
          Ask me about:
        </p>

        <ul>
          <li>SOP</li>
          <li>CNC Machine</li>
          <li>Boiler</li>
          <li>Maintenance</li>
          <li>Safety</li>
        </ul>
      `,
    },
  ]);

  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);

  async function sendMessage() {
    if (!question.trim()) return;

    const userMessage = {
      sender: "user",
      text: question,
    };

    setMessages((prev) => [...prev, userMessage]);

    const currentQuestion = question;

    setQuestion("");

    setLoading(true);

    try {
      const reply = await askAI(currentQuestion);

      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: reply,
        },
      ]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `
            <h3>❌ Error</h3>
            <p>Unable to process your request.</p>
          `,
        },
      ]);
    }

    setLoading(false);
  }

  return (
    <AppLayout>
      <div className="ai-chat-page">

        <div className="ai-chat-header">

          <div>
            <h1>KnowForge AI</h1>
            <p>Industrial Knowledge Assistant</p>
          </div>

          <div className="ai-status-box">
            <div className="status-dot"></div>
            Online
          </div>

        </div>

        <div className="ai-chat-layout">

          <div className="ai-sidebar-panel">

            <h2>Assistant</h2>

            <p>
              Search your company's industrial knowledge using natural language.
            </p>

            <div className="user-info-card">

              <span>User</span>

              <strong>{role}</strong>

              <small>{user?.email}</small>

            </div>

            <div className="suggestion-list">

              <button onClick={() => setQuestion("SOP")}>
                What is SOP?
              </button>

              <button onClick={() => setQuestion("CNC")}>
                Explain CNC Machine
              </button>

              <button onClick={() => setQuestion("Safety")}>
                Safety Guidelines
              </button>

              <button onClick={() => setQuestion("Maintenance")}>
                Maintenance
              </button>

            </div>

          </div>

          <div className="chat-container">

            <div className="chat-messages">

              {messages.map((msg, index) => (

                <div
                  key={index}
                  className={`message-row ${
                    msg.sender === "user"
                      ? "user-row"
                      : "ai-row"
                  }`}
                >

                  <div
                    className={`message-bubble ${
                      msg.sender === "user"
                        ? "user-message"
                        : "ai-message"
                    }`}
                  >

                    {msg.sender === "user" ? (
                      <pre>{msg.text}</pre>
                    ) : (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: msg.text,
                        }}
                      />
                    )}

                  </div>

                </div>

              ))}

              {loading && (

                <div className="message-row ai-row">

                  <div className="message-bubble ai-message typing">

                    🤖 Searching knowledge library...

                  </div>

                </div>

              )}

            </div>

            <div className="chat-input-area">

              <input
                type="text"
                placeholder="Ask about SOP, CNC, Boiler, Safety..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    sendMessage();
                  }
                }}
              />

              <button onClick={sendMessage}>
                Send
              </button>

            </div>

          </div>

        </div>

      </div>
    </AppLayout>
  );
}

export default AIChat;