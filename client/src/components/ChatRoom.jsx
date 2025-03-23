import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client"; // Import socket.io client

const socket = io("http://203.129.51.160:5000"); // Connect to backend

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);

  // This effect runs when the component mounts, setting up the socket connection
  // Need to remove the listener when the component unmounts to avoid memory leaks
  useEffect(() => {
    const handleMessage = (message) => {
      setMessages((prev) => [...prev, message]);
      scrollToBottom();
    };
    const handleHistory = (history) => {
      setMessages(history); // Update state with the message history
    };

    socket.on("messageHistory", handleHistory); 
    socket.on("receiveMessage", handleMessage);

    // The return is a cleanup function that runs when the component unmounts
    return () => {
      socket.off("receiveMessage", handleMessage); // ✅ Cleanup to avoid duplicate listeners
      socket.off("messageHistory", handleHistory); // ✅ Cleanup to avoid duplicate listeners
    };
  }, []);

  // This function sends a message through the 'sendMessage' event, and the input is reset
  const sendMessage = () => {
    if (input === "") {
      return; // Don't send empty messages
    }
    socket.emit("sendMessage", input.trim());
    setInput("");
  };
  // This function scrolls to the bottom of the chat window
  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col h-[1000px] w-[1000px] mx-auto border border-gray-300 rounded-lg shadow-lg">
      {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
          {messages.map((msg, index) => (<div key={index} className="bg-blue-500 text-white p-2 rounded-md"> {msg} </div>))}
        <div ref={chatEndRef} />
      </div>

      {/* Input Box */}
      <div className="flex border-t border-gray-300 p-2">
        <input
          type="text"
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button onClick={sendMessage} className="ml-2 px-4 py-2 bg-blue-600 text-white rounded-md"> Send </button>
      </div>
    </div>
  );
}