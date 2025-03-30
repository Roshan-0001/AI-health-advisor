import { useState, useRef, useEffect } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";  // ✅ Import Gemini API SDK
import "./App.css";
import ReactMarkdown from "react-markdown";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Chatbox from "./Chatbox";
import Homepage from "./Homepage";

function App() {

  return(
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Homepage />} />
        <Route path="/chat" element={<Chatbox />} />
      </Routes>
    </Router>

    </>
  )

}

export default App;