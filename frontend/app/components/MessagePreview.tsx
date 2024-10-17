import React from "react";
import { displayTime } from "../chats/helpers";
import ProfileImage from "./ProfileImage";
import { cn } from "@/lib/utils";

const MessagePreview = ({
  name,
  lastMessage,
  date,
  viewed,
  isSelected,
  maxLength = 12,
  userId,
}: {
  name: string;
  lastMessage: string;
  date: string;
  viewed: boolean;
  isSelected: boolean;
  maxLength?: number;
  userId: string;
}) => {
  const truncateMessage = (msg: string) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  if (lastMessage === "") {
    lastMessage = "Start Chatting!";
  }

  return (
    <div
      className={cn(
        "flex items-center mx-2 p-2 rounded-lg cursor-pointer hover:bg-gray-50 transition",
        isSelected && "bg-gray-50"
      )}
    >
      <ProfileImage userId={userId} />
      <div
        style={{
          flexGrow: 1,
          display: "flex",
          flexDirection: "column",
          marginLeft: "12px",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div className="text-gray-700 font-medium text-sm">{name}</div>
        </div>
        <div className="text-gray-400 text-sm">
          {truncateMessage(lastMessage)} - {displayTime(new Date(date))}
        </div>
      </div>
      <div
        style={{
          minWidth: "8px",
          minHeight: "8px",
          borderRadius: "50%",
          opacity: viewed ? 0 : 1,
          width: "8px",
          height: "8px",
        }}
        className="bg-indigo-400"
      />
    </div>
  );
};

export default MessagePreview;
