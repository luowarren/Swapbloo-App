// MessageBubble.js
import React from "react";
import PropTypes from "prop-types";
import { cn } from "@/lib/utils";
import { getUserId } from "./../../service/users";

const MessageBubble = ({ sender, text, uid }) => {
  // const uid = await getUserId();
  let isMe = false;
  if (uid != null) {
    if (sender == uid) {
      isMe = true;
    }
  }

  // const isMe = sender === "me";

  return (
    <div
      className={cn(
        "inline-block rounded-lg py-2 px-4 break-words ml-auto mr-0"
      )}
      style={{
        backgroundColor: isMe ? "#4f46e5" : "#f3f4f6",
        color: isMe ? "#FFF" : "#404040",
        marginLeft: isMe ? "auto" : "0",
        marginRight: isMe ? "0" : "auto",
        maxWidth: "60%",
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
