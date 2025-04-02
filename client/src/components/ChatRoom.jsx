import { useEffect, useState, useRef, useLayoutEffect } from "react";
import { io } from "socket.io-client"; // Import socket.io client

const socket = io("http://192.168.1.109:5000"); // Connect to backend

export default function ChatRoom() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [id, setId] = useState(null); // State to store the ID of the connected user
  const chatEndRef = useRef(null);

  // This effect runs when the component mounts, setting up the socket connection
  // Need to remove the listener when the component unmounts to avoid memory leaks
  useEffect(() => {
    const handleMessage = ({ text, sender }) => {
      console.log(`Received ${text} from ${sender}`); // Log the message and sender ID
      setMessages((prev) => [...prev, { text: text, sender: sender}]);
    };
    const handleHistory = ({history, sender}) => {
      // for (let i = 0; i < history.length; i++) {
      //   console.log(history[i].text + history[i].sender); // Assign the sender ID to each message
      // }
      setMessages((prevMessages) => [...prevMessages, ...history]);  // Update state with the message history
      setId(sender); // Store the ID of the connected user
      console.log(`Received ${history} and ID: ${sender}`); // Log the message and sender ID
    };

    socket.on("messageHistory", handleHistory); 
    socket.on("receiveMessage", handleMessage);

    // The return is a cleanup function that runs when the component unmounts
    return () => {
      socket.off("messageHistory", handleHistory); 
      socket.off("receiveMessage", handleMessage);
    };
  }, [messages]);

  // This function sends a message through the 'sendMessage' event, and the input is reset
  const sendMessage = () => {
    if (input === "") {
      return; // Don't send empty messages
    }
    socket.emit("sendMessage", { text: input.trim(), sender: id});
    setInput("");
  };
  // This function scrolls to the bottom of the chat window
  const scrollToBottom = () => {
    //chatEndRef.current?.scrollIntoView();
    const chatContainer = chatEndRef.current?.parentElement;
    if (chatContainer) {
      chatContainer.scrollTop = chatContainer.scrollHeight;
    }
  };

  // Use useLayoutEffect to scroll immediately after rendering
  useLayoutEffect(() => {
    scrollToBottom(); // Scroll to the bottom after a new message is added
  }, [messages]);

  return (
    <div className="flex flex-col h-[1000px] w-[1000px] mx-auto border border-gray-300 rounded-lg shadow-lg">
      {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.filter((obj) => obj.sender).map((obj, index) => (
          <div key={index} className={`flex ${obj.sender === id ? "justify-end" : "justify-start"}`}>
            <div className="text-xs font-bold text-gray-600">
              {obj.sender.substring(0,5)}
            </div>
            <div className={`p-2 rounded-md ${obj.sender === id ? "bg-blue-500 text-white" : "bg-gray-300 text-black"}`}>
              {obj.text}
            </div>
          </div>
        ))}
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