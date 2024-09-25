// MessageBubble.js
import React from 'react';
import PropTypes from 'prop-types';

const MessageBubble = ({ sender, text }) => {
  const isMe = sender === "me";

  return (
    <div
      className={`inline-block max-w-[50%] p-2 rounded-full py-2 pl-5 pr-5 break-words ${
        isMe ? "ml-auto text-white" : "mr-auto text-black"
      }`}
      style={{
        backgroundColor: isMe ? "#3730A3" : "#C7D2FE",
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
