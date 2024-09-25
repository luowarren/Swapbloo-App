// MessageBubble.js
import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";

const MessageBubble = ({ sender, text }) => {
  const isMe = sender === "me";

  return (
    <div
      className={cn(
        "inline-block rounded-full py-2 px-5 break-words ml-auto mr-0"
      )}
      style={{
        backgroundColor: isMe ? "#3730A3" : "#C7D2FE",
        color: isMe ? "#FFF" : "#000",
        marginLeft: isMe ? "auto" : "0",
        marginRight: isMe ? "0" : "auto",
      }}
    >
      {text}
    </div>
  );
};

MessageBubble.propTypes = {
  sender: PropTypes.string.isRequired,
  text: PropTypes.string.isRequired,
};

export default MessageBubble;
