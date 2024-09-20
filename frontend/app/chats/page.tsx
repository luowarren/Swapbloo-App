"use client"; // This marks the component as a Client Component

import React, { useState, FormEvent } from "react";
import MessagePreview from "../components/MessagePreview";

const data = [
  {
    username: "Alice",
    message: "Hey there! How's it going? Just checking in.",
    date: "2024-09-19T12:30:00Z",
    viewed: false,
  },
  {
    username: "Bob",
    message: "Don't forget about our meeting tomorrow at 10 AM.",
    date: "2024-09-18T09:15:00Z",
    viewed: true,
  },
  {
    username: "Charlie",
    message: "I found the information you requested about the project.",
    date: "2024-09-17T14:00:00Z",
    viewed: false,
  },
  {
    username: "Diana",
    message: "Can you send me the updated report when you have a moment?",
    date: "2024-09-16T08:45:00Z",
    viewed: true,
  },
  {
    username: "Eve",
    message: "Looking forward to our weekend trip!",
    date: "2024-09-15T18:00:00Z",
    viewed: false,
  },
];

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<string[]>([]);
  const [meInput, setMeInput] = useState<string>(""); // Input for sending messages as "Me"
  const [otherGuyInput, setOtherGuyInput] = useState<string>(""); // Input for receiving messages from "Other Guy"
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);

  // Handle sending messages from "Me"
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (meInput.trim()) {
      setMessages((prevMessages) => [...prevMessages, meInput]);
      setMeInput(""); // Clear "Me" input after sending
    }
  };

  // Handle receiving messages from "Other Guy"
  const handleReceive = (e: FormEvent) => {
    e.preventDefault();
    if (otherGuyInput.trim()) {
      setMessages((prevMessages) => [...prevMessages, otherGuyInput]);
      setOtherGuyInput(""); // Clear "Other Guy" input after receiving
    }
  };

  // Switch active chat
  const switchChat = (chat: number) => {
    setActiveChat(chat);
    setMessages([]); // Clear messages when switching chats
  };

  // Toggle selection of a message preview
  const toggleMessageSelection = (index: number) => {
    setSelectedMessageIndex(selectedMessageIndex === index ? null : index);
    switchChat(index);
    data[index]["viewed"] = true;
  };

  return (
    <div className="flex h-screen">
      {/* Sidebar for other chats */}
      <div className="w-1/4 bg-gray-100 py-4 border-r">
        <h2 className="text-black font-bold text-3xl p-2 px-4">Chats</h2>
        {data.map((msg, index) => (
          <div key={index} onClick={() => toggleMessageSelection(index)}>
            <MessagePreview
              username={msg.username}
              message={msg.message}
              date={msg.date}
              viewed={msg.viewed}
              isSelected={selectedMessageIndex === index} // Pass selection state
            />
          </div>
        ))}
      </div>

      {/* Main chat area */}
      <div className="flex-grow flex flex-col h-full p-4 bg-gray-100">
        <div className="flex-grow p-4 bg-white rounded-lg shadow-lg overflow-auto">
          <div className="flex flex-col space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`inline-block max-w-[50%] p-2 rounded-full py-2 pl-5 pr-5 break-words ${
                  index % 2 === 0 ? "ml-auto text-white" : "mr-auto text-black"
                }`}
                style={{
                  backgroundColor: index % 2 === 0 ? "#3730A3" : "#C7D2FE",
                }}
              >
                {msg}
              </div>
            ))}
          </div>
        </div>

        {/* Form for sending messages as "Me" */}
        <form onSubmit={handleSend} className="flex mt-4">
          <input
            type="text"
            value={meInput}
            onChange={(e) => setMeInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 text-black rounded-full mr-4"
            placeholder="Type your message..."
          />
          <button
            type="submit"
            className="text-m bg-[#C7D2FE] text-indigo-800 hover:bg-indigo-200 py-2 pl-5 pr-5 rounded-full"
          >
            Send
          </button>
        </form>

        {/* Form for receiving messages from "Other Guy" */}
        <form onSubmit={handleReceive} className="flex mt-4">
          <input
            type="text"
            value={otherGuyInput}
            onChange={(e) => setOtherGuyInput(e.target.value)}
            className="flex-grow p-2 border border-gray-300 text-black rounded-full mr-4"
            placeholder="Type a response from Other Guy..."
          />
          <button
            type="submit"
            className="text-m bg-[#C7D2FE] text-indigo-800 hover:bg-indigo-200 py-2 pl-5 pr-5 rounded-full"
          >
            Receive
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatPage;
