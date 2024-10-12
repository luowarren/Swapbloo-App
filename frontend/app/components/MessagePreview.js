import React, { use } from "react";
import { displayTime } from "../chats/helpers";
import { cn } from "@/lib/utils";
import ProfileImage from "./ProfileImage";

const MessagePreview = ({
  name,
  lastMessage,
  date,
  viewed,
  isSelected,
  userId,
  maxLength = 20,
}) => {
  const truncateMessage = (msg) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  if (lastMessage == "") {
    lastMessage = "Start Chatting!";
  }

  return (
    <div
      className={`flex items-center justify-around p-5 ${
        isSelected ? "bg-gray-100" : null
      }`}
    >
      <ProfileImage userId={userId} />
      <div className="mr-3 ml-3 flex-grow flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-black">{name}</div>
        </div>
        <div
          className={`text-gray-700 overflow-hidden whitespace-nowrap
          ${viewed ? "font-normal" : "font-bold"}`}
        >
          {truncateMessage(lastMessage)}
        </div>
        <div
          className={`text-xs text-gray-500
          ${viewed ? "font-normal" : "font-bold"}`}
        >
          {displayTime(new Date(date))}
        </div>
      </div>
      <div
        className={cn(
          "bg-blue-500 min-w-2 min-h-2 rounded-full"
          // viewed && "opacity-0"
        )}
        style={{
          width: "8px",
          height: "8px",
          opacity: viewed ? "0" : "100",
        }}
      ></div>
    </div>
  );
};

export default MessagePreview;
