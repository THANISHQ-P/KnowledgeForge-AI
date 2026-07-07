import { useEffect, useRef, useState } from "react";
import AppLayout from "../components/layout/AppLayout";
import { supabase } from "../services/supabase";
import { useAuth } from "../contexts/AuthContext";
import "../styles/aiChat.css";

function AIChat() {
  const { role, user } = useAuth();

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "Hello, I am KnowForge AI Assistant. I can help you with machines, SOPs, maintenance, safety procedures, and expert knowledge.",
    },
  ]);

  const [input, setInput] = useState("");
  const [machines, setMachines] = useState([]);
  const [loading, setLoading] = useState(false);

  const chatEndRef = useRef(null);

  useEffect(() => {
    fetchMachines();
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  async function fetchMachines() {
    if (!supabase) return;

    const { data, error } = await supabase
      .from("machines")
      .select("*")
      .order("machine_id", { ascending: true });

    if (error) {
      console.error("Machine fetch error:", error);
      return;
    }

    setMachines(data || []);
  }

  function scrollToBottom() {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }

  function generateAIResponse(question) {
    const q = question.toLowerCase();

    if (
      q.includes("hello") ||
      q.includes("hi") ||
      q.includes("hey")
    ) {
      return `Hello ${role || "Employee"}. How can I help you with industrial knowledge today?`;
    }

    if (
      q.includes("who are you") ||
      q.includes("what are you")
    ) {
      return "I am KnowForge AI Assistant, designed to help manufacturing companies preserve expert knowledge, SOPs, troubleshooting steps, and machine maintenance information.";
    }

    if (
      q.includes("total machine") ||
      q.includes("how many machine") ||
      q.includes("machines count")
    ) {
      return `There are currently ${machines.length} machines registered in the system.`;
    }

    if (
      q.includes("running machine") ||
      q.includes("machine running")
    ) {
      const running = machines.filter(
        (m) => m.status?.toLowerCase() === "running"
      );

      return `Currently, ${running.length} machine(s) are in Running status.`;
    }

    if (
      q.includes("maintenance machine") ||
      q.includes("under maintenance") ||
      q.includes("maintenance status")
    ) {
      const maintenance = machines.filter(
        (m) => m.status?.toLowerCase() === "maintenance"
      );

      return `Currently, ${maintenance.length} machine(s) are under Maintenance.`;
    }

    if (
      q.includes("offline machine") ||
      q.includes("machine offline")
    ) {
      const offline = machines.filter(
        (m) => m.status?.toLowerCase() === "offline"
      );

      return `Currently, ${offline.length} machine(s) are Offline.`;
    }

    if (
      q.includes("list machine") ||
      q.includes("show machine") ||
      q.includes("all machines")
    ) {
      if (machines.length === 0) {
        return "No machines are currently added in the system.";
      }

      return machines
        .map(
          (machine) =>
            `${machine.machine_id} - ${machine.machine_name} | ${machine.department || "No Department"} | ${machine.status || "No Status"}`
        )
        .join("\n");
    }

    const foundMachine = machines.find((machine) => {
      const machineId = machine.machine_id?.toLowerCase();
      const machineName = machine.machine_name?.toLowerCase();

      return (
        q.includes(machineId) ||
        q.includes(machineName)
      );
    });

    if (foundMachine) {
      return `Machine Details:

Machine ID: ${foundMachine.machine_id}
Machine Name: ${foundMachine.machine_name}
Department: ${foundMachine.department || "Not Available"}
Status: ${foundMachine.status || "Not Available"}
Location: ${foundMachine.location || "Not Available"}
Manufacturer: ${foundMachine.manufacturer || "Not Available"}
Model: ${foundMachine.model || "Not Available"}`;
    }

    if (
      q.includes("sop") ||
      q.includes("standard operating procedure")
    ) {
      return "SOPs are Standard Operating Procedures. In KnowForge AI, SOPs can be uploaded by experts and accessed by employees for training, safety, maintenance, and machine operation.";
    }

    if (
      q.includes("upload") &&
      q.includes("sop")
    ) {
      if (role === "Expert" || role === "Manager" || role === "Admin") {
        return "You can upload SOPs from the Expert or Updates section. This feature will allow technical documents, repair guides, and safety procedures to be stored in the Knowledge Library.";
      }

      return "Only Experts, Managers, or Admins can upload SOPs. Employees can view and read approved SOPs.";
    }

    if (
      q.includes("maintenance")
    ) {
      return "Maintenance information helps track machine health, reduce downtime, and prevent repeated failures. Managers can assign maintenance tasks, and experts can provide repair knowledge.";
    }

    if (
      q.includes("knowledge loss") ||
      q.includes("expert resign") ||
      q.includes("resignation")
    ) {
      return "KnowForge AI prevents knowledge loss by capturing expert knowledge before resignation or retirement. Experts can submit troubleshooting steps, SOPs, repair methods, and machine-specific experience.";
    }

    if (
      q.includes("safety") ||
      q.includes("accident") ||
      q.includes("ppe")
    ) {
      return "Safety knowledge includes PPE instructions, emergency procedures, machine safety rules, inspection checklists, and accident prevention steps.";
    }

    if (
      q.includes("department") ||
      q.includes("production") ||
      q.includes("quality") ||
      q.includes("warehouse") ||
      q.includes("maintenance")
    ) {
      return "KnowForge AI supports multiple departments such as Production, Maintenance, Quality Control, Safety, Warehouse, and HR.";
    }

    return "I could not find an exact answer yet. You can ask me about machines, SOPs, maintenance, safety procedures, departments, or expert knowledge capture.";
  }

  function handleSendMessage() {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      text: input,
    };

    setMessages((prev) => [...prev, userMessage]);

    const question = input;
    setInput("");
    setLoading(true);

    setTimeout(() => {
      const aiReply = {
        sender: "ai",
        text: generateAIResponse(question),
      };

      setMessages((prev) => [...prev, aiReply]);
      setLoading(false);
    }, 700);
  }

  function handleKeyPress(e) {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  }

  function handleSuggestionClick(text) {
    setInput(text);
  }

  return (
    <AppLayout>
      <div className="ai-chat-page">

        <div className="ai-chat-header">
          <div>
            <h1>AI Chat Assistant</h1>
            <p>
              Ask about machines, SOPs, maintenance, safety, and knowledge transfer.
            </p>
          </div>

          <div className="ai-status-box">
            <span className="status-dot"></span>
            Online
          </div>
        </div>

        <div className="ai-chat-layout">

          <div className="ai-sidebar-panel">
            <h2>KnowForge AI</h2>

            <p>
              Industrial knowledge assistant for ABC Manufacturing Pvt. Ltd.
            </p>

            <div className="user-info-card">
              <span>Logged in as</span>
              <strong>{role || "Employee"}</strong>
              <small>{user?.email}</small>
            </div>

            <div className="suggestion-list">
              <button onClick={() => handleSuggestionClick("How many machines are available?")}>
                Total machines
              </button>

              <button onClick={() => handleSuggestionClick("Show all machines")}>
                Show all machines
              </button>

              <button onClick={() => handleSuggestionClick("What is SOP?")}>
                What is SOP?
              </button>

              <button onClick={() => handleSuggestionClick("How does KnowForge prevent knowledge loss?")}>
                Knowledge loss
              </button>

              <button onClick={() => handleSuggestionClick("Tell me about maintenance")}>
                Maintenance help
              </button>
            </div>
          </div>

          <div className="chat-container">

            <div className="chat-messages">

              {messages.map((message, index) => (
                <div
                  key={index}
                  className={
                    message.sender === "user"
                      ? "message-row user-row"
                      : "message-row ai-row"
                  }
                >
                  <div
                    className={
                      message.sender === "user"
                        ? "message-bubble user-message"
                        : "message-bubble ai-message"
                    }
                  >
                    <pre>{message.text}</pre>
                  </div>
                </div>
              ))}

              {loading && (
                <div className="message-row ai-row">
                  <div className="message-bubble ai-message typing">
                    KnowForge AI is thinking...
                  </div>
                </div>
              )}

              <div ref={chatEndRef}></div>

            </div>

            <div className="chat-input-area">

              <input
                type="text"
                placeholder="Ask KnowForge AI..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyPress}
              />

              <button onClick={handleSendMessage}>
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