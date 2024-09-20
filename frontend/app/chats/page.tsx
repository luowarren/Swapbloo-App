"use client"; // This marks the component as a Client Component

import React, { useState, FormEvent, useRef, useEffect } from "react";
import MessagePreview from "../components/MessagePreview";
import { data } from "./data.js";

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [meInput, setMeInput] = useState<string>(""); // Input for sending messages as "Me"
  const [otherGuyInput, setOtherGuyInput] = useState<string>(""); // Input for receiving messages from "Other Guy"
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [selectedMessageIndex, setSelectedMessageIndex] = useState<
    number | null
  >(null);
  const messageBoxRef = useRef<HTMLDivElement>(null); // Create a ref for the messageBox

  // Scroll to the bottom of the messageBox when messages change
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  // Handle sending messages from "Me"
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (meInput.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: meInput, sender: "me" },
      ]);
      setMeInput(""); // Clear "Me" input after sending
    }
  };

  // Handle receiving messages from "Other Guy"
  const handleReceive = (e: FormEvent) => {
    e.preventDefault();
    if (otherGuyInput.trim()) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { text: otherGuyInput, sender: "other" },
      ]);
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
    <div className="flex h-[85vh]">
      {/* Sidebar for other chats */}
      <div className="w-1/4 bg-gray-100 py-4 border-r overflow-y-auto h-full">
        <h2 className="text-black font-bold text-3xl p-2 m-0 px-4 fixed bg-gray-100">Chats</h2>
        <h2 className="text-gray-100 font-bold text-3xl p-2 px-4 h-[7vh]"></h2>
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
      {activeChat !== null && (
        <div className="flex-grow flex flex-col h-full p-4 bg-gray-100">
          {/* Banner for active chat */}
          <div className="w-full bg-white text-black p-4 rounded-t-lg text-2xl text-bold flex flex-row items-center ">
            <div className="w-12 h-12 bg-yellow-500 rounded-full mr-3"></div>
            {data[activeChat].username}'s Swap Shop
          </div>
          <div
            ref={messageBoxRef} // Attach the ref here
            id="messageBox"
            className="flex-grow p-4 bg-white rounded-lg shadow-lg overflow-auto relative"
          >
            <div className="pt-12">
              {" "}
              {/* Add padding to prevent overlap */}
              <div className="flex flex-col space-y-2">
                {messages.map((msg, index) => (
                  <div
                    key={index}
                    className={`inline-block max-w-[50%] p-2 rounded-full py-2 pl-5 pr-5 break-words ${
                      msg.sender === "me"
                        ? "ml-auto text-white"
                        : "mr-auto text-black"
                    }`}
                    style={{
                      backgroundColor:
                        msg.sender === "me" ? "#3730A3" : "#C7D2FE",
                    }}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>
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
      )}
      {activeChat === null && (
        <div className="flex-grow flex flex-col h-full p-4 bg-gray-100"></div>
      )}
    </div>
  );
};

export default ChatPage;
