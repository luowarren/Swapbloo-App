import React, { useState, useRef, useEffect } from "react";
import { displayTime } from "../chats/helpers";
import { cn } from "@/lib/utils";
import { deleteChat } from "@/service/chat";

const MessagePreview = ({
  id,
  name,
  lastMessage,
  date,
  viewed,
  isSelected,
  maxLength = 20,
  handleDelete,
}) => {
  console.log(id);
  const [isSwiped, setIsSwiped] = useState(false);
  const [startX, setStartX] = useState(0);
  const [isClicking, setIsClicking] = useState(false);
  const previewRef = useRef(null);

  const truncateMessage = (msg) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  if (lastMessage === "") {
    lastMessage = "Start Chatting!";
  }

  const handleTouchStart = (e) => {
    setStartX(e.touches[0].clientX);
    setIsClicking(true);
  };

  const handleTouchMove = (e) => {
    if (!isClicking) return;

    const currentX = e.touches[0].clientX;
    const distance = startX - currentX;

    if (distance > 50) {
      setIsSwiped(true);
    } else if (distance < -50) {
      setIsSwiped(false);
    }
  };

  const handleTouchEnd = () => {
    setStartX(0);
    setIsClicking(false);
  };

  const handleMouseDown = (e) => {
    setStartX(e.clientX);
    setIsClicking(true);
  };

  const handleMouseMove = (e) => {
    if (!isClicking) return;

    const currentX = e.clientX;
    const distance = startX - currentX;

    if (distance > 50) {
      setIsSwiped(true);
    } else if (distance < -50) {
      setIsSwiped(false);
    }
  };

  const handleMouseUp = () => {
    setStartX(0);
    setIsClicking(false);
  };

  const onDelete = () => {
    handleDelete(id); // Call the parent function to delete the message
    setIsSwiped(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (previewRef.current && !previewRef.current.contains(event.target)) {
        setIsSwiped(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div
      ref={previewRef}
      className={`relative flex items-center p-5 ${
        isSelected ? "bg-gray-100" : ""
      }`}
      style={{
        transition: "transform 0.3s ease",
        userSelect: "none", // Prevent text selection
      }}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      <div className="w-12 h-12 bg-yellow-500 rounded-full mr-3" />
      <div className="flex-grow flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-black">{name}</div>
        </div>
        <div
          className={`text-gray-700 overflow-hidden whitespace-nowrap ${
            viewed ? "font-normal" : "font-bold"
          }`}
        >
          {truncateMessage(lastMessage)}
        </div>
        <div
          className={`text-xs text-gray-500 ${
            viewed ? "font-normal" : "font-bold"
          }`}
        >
          {displayTime(new Date(date))}
        </div>
      </div>
      <div
        className={cn(
          "bg-blue-500 min-w-2 min-h-2 rounded-full",
          viewed && "opacity-0"
        )}
        style={{
          width: "8px",
          height: "8px",
          opacity: viewed ? "0" : "100",
        }}
      ></div>
      <button
        onClick={onDelete}
        style={{
          position: "absolute",
          top: 0,
          right: 0,
          transform: isSwiped ? "translateX(0)" : `translateX(100%)`, // Slide in
          transition: "transform 0.3s ease",
          backgroundColor: "red",
          color: "white",
          padding: "0.5rem 1rem",
          borderRadius: "0.25rem",
          height: "100%",
          border: "none", // Ensure no border adds space
          width: "100px", // Ensure a fixed width for consistency
          zIndex: 1, // Make sure it appears on top of other elements
        }}
      >
        Delete
      </button>
    </div>
  );
};

export default MessagePreview;
