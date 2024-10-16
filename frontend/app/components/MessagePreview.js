import React from "react";
import { displayTime } from "../chats/helpers";
import ProfileImage from "./ProfileImage";

const MessagePreview = ({
  name,
  lastMessage,
  date,
  viewed,
  isSelected,
  maxLength = 18,
  userId,
}) => {
  const truncateMessage = (msg) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  if (lastMessage === "") {
    lastMessage = "Start Chatting!";
  }

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent:"space-between",
        padding: "20px",
        backgroundColor: isSelected ? "#f7fafc" : "transparent", // Equivalent to bg-gray-100
      }}
    >
      <ProfileImage userId={userId} />
      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column", marginLeft: "12px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ fontSize: "1.125rem", fontWeight: "bold", color: "#000" }}>{name}</div>
        </div>
        <div
          style={{
            color: "#4a5568", // Equivalent to text-gray-700
            overflow: "hidden",
            whiteSpace: "nowrap",
            fontWeight: viewed ? "normal" : "bold",
            fontSize: "0.9rem",
          }}
        >
          {truncateMessage(lastMessage)}
        </div>
        <div
          style={{
            fontSize: "0.75rem", // Equivalent to text-xs
            color: "#718096", // Equivalent to text-gray-500
            fontWeight: viewed ? "normal" : "bold",
          }}
        >
          {displayTime(new Date(date))}
        </div>
      </div>
      <div
        style={{
          backgroundColor: "#4299e1", // Equivalent to bg-blue-500
          minWidth: "8px",
          minHeight: "8px",
          borderRadius: "50%",
          opacity: viewed ? 0 : 1,
          width: "8px",
          height: "8px",
        }}
      ></div>
    </div>
  );
};

export default MessagePreview;
