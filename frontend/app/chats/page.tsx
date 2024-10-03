"use client"; // This marks the component as a Client Component

import React, { useState, FormEvent, useRef, useEffect } from "react";
import MessagePreview from "../components/MessagePreview";
import MessageBubble from "../components/MessageBubble";
import UserRating from "../components/UserRating";

import { useRouter } from 'next/navigation'; // Next.js router for redirection
import Map from "../components/Map";
import ItemPreview from "../components/ItemPreview";
import LocationSelector from "../components/Location";
import GenericButton from "../components/GenericButton";
import { data } from "./data.js";
import { sortData, placeholder } from "./helpers";
import { supabase } from "@/service/supabaseClient";

import { ArrowRightLeft } from "lucide-react";
sortData(data);

const ChatPage: React.FC = () => {
  const [messages, setMessages] = useState<
    { type: string; text: string; sender: string }[]
  >([]);
  const [user, setUser] = useState<any>(null); // State for user
  const [loading, setLoading] = useState(true); // For handling the loading state
  const router = useRouter();
  const [meInput, setMeInput] = useState<string>(""); // Input for sending messages as "Me"
  const [otherGuyInput, setOtherGuyInput] = useState<string>(""); // Input for receiving messages from "Other Guy"
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [accepted, setAccepted] = useState<boolean>(false);
  const messageBoxRef = useRef<HTMLDivElement>(null); // Create a ref for the messageBox

  // Scroll to the bottom of the messageBox when messages change
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);


  const setNotification = (notif: string, type: string = "notification") => {

//   useEffect(() => {
//     const checkUser = async () => {
//       const { data, error } = await supabase.auth.getUser();
//       if (data?.user) {
//         setUser(data.user);
//       } else {
//         router.push('/login'); // Redirect to /login if no user is found
//       }
//       setLoading(false);
//     };
//     checkUser();
//   }, [router]);


    if (activeChat != null) {
      data[activeChat]["lastMessage"] = notif;
      data[activeChat]["date"] = new Date().toISOString();

      sortData(data);
      setActiveChat(0);

      setMessages((prevMessages) => [
        ...prevMessages,
        {
          type: type,
          text: notif,
          sender: "me",
          date: new Date().toISOString(),
        },
      ]);
      //   console.log(messages);
    }
  };

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
        {
          type: "text",
          text: meInput,
          sender: "me",
          date: new Date().toISOString(),
        },
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
          type: "text",
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
    setAccepted(false);
  };

  // Toggle selection of a lastMessage preview
  const toggleMessageSelection = (index: number) => {
    switchChat(index);
    data[index]["viewed"] = true;
  };

  return (
    <div className="flex h-[85vh]">
      {/* Sidebar for other chats */}
      <div className="flex flex-col w-1/4 py-4 pt-0 border-r overflow-y-auto h-full bg-white">
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
        <div className="flex-grow flex flex-col h-full p-4 bg-gray-100 w-[55%]">
          {/* Banner for active chat */}

          <div
            ref={messageBoxRef} // Attach the ref here
            id="messageBox"
            className="flex-grow p-4 bg-white rounded-lg shadow-lg overflow-auto relative border"
          >
            <div className="w-full bg-white text-black p-4 rounded-lg shadow-lg text-2xl text-bold flex flex-col items-center border mb-4">
              <div className="font-bold text-2xl mb-4">Swap Details</div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: "1em",
                  width: "100%",
                  flexWrap: "wrap",
                }}
              >
                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    maxWidth: "80%",
                    flexWrap: "wrap",
                  }}
                >
                  <ItemPreview text="dress xs" />
                  <ItemPreview />
                  <ArrowRightLeft />
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-evenly",
                    alignItems: "center",
                    maxWidth: "80%",
                    flexWrap: "wrap",
                  }}
                >
                  <ItemPreview text="bucket hat" />
                </div>
              </div>
              <div
                style={{
                  display: "flex",
                  flexDirection: "row",
                  justifyContent: "space-around",
                  width: "50%",
                }}
              >
                {" "}
                {accepted ? (
                  <GenericButton
                    text="Update Offer"
                    // inverse={true}
                    noClick={true}
                  />
                ) : (
                  <GenericButton
                    text="Update Offer"
                    click={() => {
                      setNotification(
                        `You updated the offer with ${data[activeChat].name}`
                      );
                    }}
                  />
                )}
                {accepted ? (
                  <GenericButton
                    text="Accept Offer"
                    // inverse={true}
                    noClick={true}
                  />
                ) : (
                  <GenericButton
                    text="Accept Offer"
                    click={() => {
                      setAccepted(true);
                      setNotification(
                        `You accepted the offer with ${data[activeChat].name}!`,
                        "accept"
                      );
                    }}
                  />
                )}
              </div>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                width: "100%",
                color: "gray",
                marginBottom: "7px",
              }}
            >
              This is the start of your chat with {data[activeChat]["name"]}
            </div>
            <div>
              {/* Add padding to prevent overlap */}
              <div className="flex flex-col space-y-2">
                {messages.map((msg, index) => {
                  switch (msg.type) {
                    case "text":
                      return (
                        <MessageBubble
                          key={index}
                          sender={msg.sender}
                          text={msg.text}
                        />
                      );
                    case "accept":
                      console.log(accepted);
                      return (
                        <div
                          style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <div
                            key={index}
                            style={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "center",
                              width: "100%",
                              color: "gray",
                            }}
                          >
                            {msg.text}
                          </div>
                          <div
                            style={{
                              border: "2px solid black",
                              borderRadius: "15px",
                              paddingTop: "20px",
                              paddingBottom: "10px",
                              margin: "20px",
                              marginBottom: "10px",
                              width: "60%",
                              textAlign: "center",
                              color: "#3730A3",
                              fontWeight: "bold",
                            }}
                          >
                            Swap Success!
                            <div
                              style={{
                                display: "flex",
                                justifyContent: "space-around",
                                alignItems: "center",
                                width: "100%",
                                color: "black",
                              }}
                            >
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  width: "100%",
                                  padding: "20px",
                                }}
                              >
                                <div>You and Sohee saved:</div>
                                <div className="text-yellow-500 text-3xl font-bold">
                                  220kg
                                </div>
                                <div>of CO2 easte</div>
                              </div>
                              <div
                                style={{
                                  display: "flex",
                                  flexDirection: "column",
                                  justifyContent: "space-around",
                                  alignItems: "center",
                                  width: "100%",
                                  padding: "20px",
                                }}
                              >
                                <div>You've made:</div>
                                <div className="text-yellow-500 text-3xl font-bold">
                                  21
                                </div>
                                <div>successful swaps</div>
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              border: "2px solid black",
                              borderRadius: "15px",
                              padding: "5px",
                              width: "60%",
                              textAlign: "center",
                              fontWeight: "bold",
                            }}
                          >
                            <UserRating size="text-2xl"></UserRating>
                          </div>
                        </div>
                      );
                    default:
                      console.log(accepted);
                      return (
                        <div
                          key={index}
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            width: "100%",
                            color: "gray",
                          }}
                        >
                          {msg.text}
                        </div>
                      );
                  }
                })}
              </div>
            </div>
          </div>

          {/* Form for sending messages as "Me" */}
          <form onSubmit={handleSend} className="flex mt-4">
            <input
              type="text"
              value={meInput}
              onChange={(e) => {
                setMeInput(e.target.value);
              }}
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
              onChange={(e) => {
                setOtherGuyInput(e.target.value);
              }}
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
      {/* Other users info and meetup info */}
      {activeChat !== null && (
        <div className="flex flex-col w-1/5 py-4 pt-0 border-r overflow-y-auto h-full bg-gray-100 pr-3">
          <div className="w-full bg-white text-black p-4 rounded-lg text-2xl flex flex-col items-center mt-4 border">
            <div className="w-16 h-16 bg-yellow-500 rounded-full mb-3"></div>
            <div className="font-bold overflow-auto text-center">
              {data[activeChat].name}'s Swap Shop
            </div>
            <div className="text-sm text-gray-500">
              {data[activeChat].username}
            </div>
            <UserRating rating={Number(data[activeChat].rating)} num={8} />
            <GenericButton text="Visit Shop" inverse={true} />
          </div>
          <div className="w-full bg-white text-black py-4 px-4 rounded-lg flex flex-col items-center mt-4 border">
            <div className="font-bold text-2xl">Meetup Info</div>
            <LocationSelector
              click={() => {
                setNotification(
                  `You updated the meetup details with ${data[activeChat].name}`
                );
              }}
            />
          </div>
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
