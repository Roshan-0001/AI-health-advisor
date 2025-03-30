import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import ReactMarkdown from "react-markdown";
const ai = new GoogleGenerativeAI(import.meta.env.VITE_API_GENERATIVE_LANGUAGE_CLIENT);

const Chatbox = () => {

const [chatHistory, setChatHistory] = useState([]);
const [question, setQuestion] = useState("");
const [generatingAnswer, setGeneratingAnswer] = useState(false);

const chatContainerRef = useRef(null);

useEffect(() => {
  if (chatContainerRef.current) {
    chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
  }
}, [chatHistory, generatingAnswer]);

// Function to generate AI response
async function generateAnswer(e) {
  e.preventDefault();
  if (!question.trim()) return;

  setGeneratingAnswer(true);
  const currentQuestion = question;
  setQuestion(""); // Clear input field

  // Add user question to chat history
  setChatHistory(prev => [...prev, { type: 'question', content: currentQuestion }]);

  try {
    const model = ai.getGenerativeModel({ model: "gemini-1.5-flash" });

    const response = await model.generateContent({
      contents: [{ parts: [{ text: currentQuestion }] }],
    });

    // Extract AI's response
    const aiResponse = response.response.text();

    // Add AI response to chat history
    setChatHistory(prev => [...prev, { type: 'answer', content: aiResponse }]);
  } catch (error) {
    console.error("Error generating response:", error);
    setChatHistory(prev => [...prev, { type: 'answer', content: "Sorry, something went wrong. Please try again!" }]);
  }

  setGeneratingAnswer(false);
}

return (
  <div className="fixed inset-0 chatbox">
    <div className="h-full max-w-4xl mx-auto flex flex-col p-3 ">
      {/* Header */}
      <header className="text-center py-4">
          <h1 className=" chatbox-header">
          AI Health Advisor
          </h1>
      </header>

      {/* Chat Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto mb-4 rounded-lg bg-white  hide-scrollbar chatbox-chat"
      >
        {chatHistory.length === 0 ? (
          <div className="h-full flex flex-col items-center justify-center text-center p-6">
            <div className="bg-blue-50 rounded-xl p-8 max-w-2xl">
              <h2 className="text-2xl font-bold text-blue-600 mb-4">Welcome 👋</h2>
              <p className="text-gray-600 mb-4">Ask me anything:</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-blue-500">😷 Health Related Issues</span> 
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-blue-500">🔎 Symptoms & Diagnosis</span> 
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-blue-500">📝 Medical Guide</span> 
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <span className="text-blue-500">🏋️‍♀️ Diet and Nutrition</span> 
                </div>
              </div>
            </div>
          </div>
        ) : (
          <>
            {chatHistory.map((chat, index) => (
              <div key={index} className={`mb-4 ${chat.type === 'question' ? 'text-right' : 'text-left'}`}>
                <div className={`inline-block max-w-[80%] p-3 rounded-lg overflow-auto hide-scrollbar ${
                  chat.type === 'question' 
                    ? 'bg-blue-500 text-white rounded-br-none'
                    : 'bg-gray-100 text-gray-800 rounded-bl-none'
                }`}>
                  <ReactMarkdown>{chat.content}</ReactMarkdown>
                </div>
              </div>
            ))}
          </>
        )}
        {generatingAnswer && (
          <div className="text-left">
            <div className="inline-block bg-gray-100 p-3 rounded-lg animate-pulse">
              Thinking...
            </div>
          </div>
        )}
      </div>

      {/* Input Form */}
      <form onSubmit={generateAnswer} className=" rounded-lg shadow-lg p-4 chatbox-input">
        <div className="flex gap-2 ">
          <textarea
            required
            className="flex-1 border border-gray-300 rounded p-3 focus:border-blue-400 focus:ring-1 focus:ring-blue-400 resize-none chatbox-textarea"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            placeholder="Ask anything..."
            rows="2"
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                generateAnswer(e);
              }
            }}
          ></textarea>
          <button
            type="submit"
            className={`px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors ${
              generatingAnswer ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={generatingAnswer}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  </div>
);
}
export default Chatbox;