import React from "react";

const MessagePreview = ({
  username,
  message,
  date,
  viewed,
  isSelected,
  maxLength = 30,
}) => {
  const truncateMessage = (msg) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  return (
    <div className={`flex items-center p-5 ${isSelected ? 'bg-gray-120' : 'bg-gray-100'}`}>
      <div className="w-10 h-10 bg-yellow-500 rounded-full mr-3"></div>
      <div className="flex-grow flex flex-col">
        <div className="flex items-center justify-between">
          <div className="text-lg font-bold text-black">{username}</div>
        </div>
        <div className="text-gray-500 truncate overflow-hidden whitespace-nowrap">
          {truncateMessage(message)}
        </div>
        <div className="text-xs text-gray-500">
          {new Date(date).toLocaleString()}
        </div>
      </div>
      <div
        className={`bg-blue-500 ${
          viewed ? "w-0 h-0 rounded-full" : "w-2 h-2 rounded-full"
        }`}
      ></div>
    </div>
  );
};

export default MessagePreview;
