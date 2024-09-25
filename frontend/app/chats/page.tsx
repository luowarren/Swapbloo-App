"use client"; // This marks the component as a Client Component

import React, { useState, FormEvent, useRef, useEffect } from "react";
import MessagePreview from "../components/MessagePreview";
import MessageBubble from "../components/MessageBubble";
import UserRating from "../components/UserRating";
import { data } from "./data.js";
import { sortData } from "./helpers";
sortData(data);

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<{ text: string; sender: string }[]>(
    []
  );
  const [meInput, setMeInput] = useState<string>(""); // Input for sending messages as "Me"
  const [otherGuyInput, setOtherGuyInput] = useState<string>(""); // Input for receiving messages from "Other Guy"
  const [activeChat, setActiveChat] = useState<number | null>(null);
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
    if (meInput.trim() && activeChat != null) {
      data[activeChat]["lastMessage"] = meInput;
      data[activeChat]["date"] = new Date().toISOString();

      sortData(data);
      setActiveChat(0);

      setMessages((prevMessages) => [
        ...prevMessages,
        { text: meInput, sender: "me", date: new Date().toISOString() },
      ]);
      console.log(messages);
      setMeInput(""); // Clear "Me" input after sending
    }
  };

  // Handle receiving messages from "Other Guy"
  const handleReceive = (e: FormEvent) => {
    e.preventDefault();
    if (otherGuyInput.trim() && activeChat != null) {
      data[activeChat]["lastMessage"] = otherGuyInput;
      data[activeChat]["date"] = new Date().toISOString();

      sortData(data);
      setActiveChat(0);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          text: otherGuyInput,
          sender: "other",
          date: new Date().toISOString(),
        },
      ]);
      console.log(messages);
      setOtherGuyInput(""); // Clear "Other Guy" input after receiving
    }
  };

  // Switch active chat
  const switchChat = (chat: number) => {
    setActiveChat(chat);
    setMessages(data[chat]["messages"]); // Clear messages when switching chats
  };

  // Toggle selection of a lastMessage preview
  const toggleMessageSelection = (index: number) => {
    switchChat(index);
    data[index]["viewed"] = true;
  };

  return (
    <div className="flex h-[85vh]">
      {/* Sidebar for other chats */}
      <div className="flex flex-col w-1/4 py-4 pt-0 border-r overflow-y-auto h-full bg-gray-100">
        <div className="flex items-center text-black font-bold text-3xl p-2 pt-4 m-0 px-4 border h-[10vh] ">
          <h2>Chats</h2>
        </div>
        <div className="flex flex-col h-[75vh] overflow-scroll">
          {data.map((msg, index) => (
            <div key={index} onClick={() => toggleMessageSelection(index)}>
              <MessagePreview
                name={msg.name}
                lastMessage={msg.lastMessage}
                date={msg.date}
                viewed={msg.viewed}
                isSelected={activeChat === index} // Pass selection state
              />
            </div>
          ))}
        </div>
      </div>

      {/* Main chat area */}
      {activeChat !== null && (
        <div className="flex-grow flex flex-col h-full p-4 bg-gray-100">
          {/* Banner for active chat */}
          <div className="w-full bg-white text-black p-4 rounded-t-lg text-2xl text-bold flex flex-row items-center ">
            <div className="w-12 h-12 bg-yellow-500 rounded-full mr-3"></div>
            {data[activeChat].name}'s Swap Shop
          </div>
          <div
            ref={messageBoxRef} // Attach the ref here
            id="messageBox"
            className="flex-grow p-4 bg-white rounded-lg shadow-lg overflow-auto relative"
          >
            <div className="pt-12">
              {/* Add padding to prevent overlap */}
              <div className="flex flex-col space-y-2">
                {messages.map((msg, index) => (
                  <MessageBubble
                    key={index}
                    sender={msg.sender}
                    text={msg.text}
                  />
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
              placeholder="Type your lastMessage..."
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
      {activeChat !== null && (
        <div className="flex flex-col w-1/5 py-4 pt-0 border-r overflow-y-auto h-full bg-gray-100 pr-3">
          <div className="w-full bg-white text-black p-4 rounded-lg text-2xl text-bold flex flex-col items-center mt-4">
            <div className="w-16 h-16 bg-yellow-500 rounded-full mb-3"></div>
            <div>{data[activeChat].name}'s Swap Shop</div>
            <div className="text-sm text-gray-500">
              {data[activeChat].username}
            </div>
            <UserRating rating={Number(data[activeChat].rating)} />
          </div>

          <div className="w-full bg-white text-black p-4 rounded-lg text-2xl text-bold flex flex-col items-center mt-4"></div>
        </div>
      )}
      {activeChat === null && (
        <div className="flex-grow grid place-items-center h-full p-4 bg-gray-100">
          <img
            src="https://nuynivbpnulznjcmtvpq.supabase.co/storage/v1/object/public/images/test_image.jpeg"
            alt="placeholder"
            className="w-[600px] h-[600px]"
          />
        </div>
      )}
    </div>
  );
};

export default ChatPage;
