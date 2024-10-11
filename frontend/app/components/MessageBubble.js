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
        "inline-block rounded-2xl py-2 px-4 break-words ml-auto mr-0"
      )}
      style={{
        backgroundColor: isMe ? "#3730A3" : "#C7D2FE",
        color: isMe ? "#FFF" : "#000",
        marginLeft: isMe ? "auto" : "0",
        marginRight: isMe ? "0" : "auto",
        width: "60%",
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
