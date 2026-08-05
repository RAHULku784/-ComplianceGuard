import {
  useEffect,
  useRef,
  useState,
} from "react";

import {
  FaTimes,
  FaPaperPlane,
} from "react-icons/fa";

import "../styles/AIAssistant.css";

import {
  askComplianceAI,
} from "../services/api";


function AIAssistant({ isOpen, onClose }) {

  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text:
        "👋 Hello! I'm Compliance AI. " +
        "Ask me about compliance scores, risks, " +
        "audits, overdue checks, pending checks, " +
        "or recommendations.",
    },
  ]);

  const [input, setInput] = useState("");

  const [loading, setLoading] =
    useState(false);

  const chatEndRef = useRef(null);


  // Auto scroll when new message arrives
  useEffect(() => {

    chatEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });

  }, [messages, loading]);


  if (!isOpen) return null;


  const sendMessage = async () => {

    const message = input.trim();

    if (!message || loading) {
      return;
    }


    const userMessage = {
      sender: "user",
      text: message,
    };


    // Add user message immediately
    setMessages((previous) => [
      ...previous,
      userMessage,
    ]);

    setInput("");
    setLoading(true);


    try {

      const data =
        await askComplianceAI(message);


      const aiMessage = {
        sender: "ai",
        text:
          data.answer ||
          "I couldn't generate a response.",
      };


      setMessages((previous) => [
        ...previous,
        aiMessage,
      ]);


    } catch (error) {

      console.error(
        "AI Assistant error:",
        error
      );


      setMessages((previous) => [
        ...previous,
        {
          sender: "ai",
          text:
            "⚠️ I couldn't connect to the " +
            "Compliance AI service. Please try again.",
        },
      ]);


    } finally {

      setLoading(false);

    }
  };


  const handleKeyDown = (event) => {

    if (
      event.key === "Enter" &&
      !event.shiftKey
    ) {

      event.preventDefault();

      sendMessage();

    }
  };


  return (

    <div className="ai-box">


      {/* Header */}

      <div className="ai-header">

        <div>

          <h3>
            🤖 Compliance AI
          </h3>

          <span className="ai-status">
            ● Live Compliance Data
          </span>

        </div>


        <FaTimes
          className="close-btn"
          onClick={onClose}
        />

      </div>


      {/* Chat */}

      <div className="chat-area">


        {messages.map(
          (message, index) => (

            <div
              key={index}
              className={
                message.sender === "user"
                  ? "user-message"
                  : "ai-message"
              }
            >
              {message.text}
            </div>

          )
        )}


        {loading && (

          <div className="ai-message ai-thinking">

            <span />
            <span />
            <span />

          </div>

        )}


        <div ref={chatEndRef} />


      </div>


      {/* Suggestions */}

      {messages.length === 1 && (

        <div className="ai-suggestions">

          <button
            type="button"
            onClick={() =>
              setInput(
                "Give me a compliance summary"
              )
            }
          >
            📊 Compliance Summary
          </button>


          <button
            type="button"
            onClick={() =>
              setInput(
                "How many audits are overdue?"
              )
            }
          >
            ⚠️ Overdue Audits
          </button>


          <button
            type="button"
            onClick={() =>
              setInput(
                "What are your recommendations?"
              )
            }
          >
            💡 Recommendations
          </button>

        </div>

      )}


      {/* Footer */}

      <div className="ai-footer">

        <input
          type="text"
          placeholder="Ask Compliance AI..."
          value={input}
          disabled={loading}
          onChange={(event) =>
            setInput(event.target.value)
          }
          onKeyDown={handleKeyDown}
        />


        <button
          type="button"
          onClick={sendMessage}
          disabled={
            loading ||
            !input.trim()
          }
        >

          <FaPaperPlane />

        </button>

      </div>


    </div>

  );
}


export default AIAssistant;