"use client"; // This marks the component as a Client Component

import React, { useState, FormEvent, useRef, useEffect } from "react";
import MessagePreview from "../components/MessagePreview";
import MessageBubble from "../components/MessageBubble";
import UserRating from "../components/UserRating";
import UpdateSwapModal from "../components/UpdateSwapModal";
import { useRouter } from "next/navigation"; // Next.js router for redirection
import ItemPreview from "../components/ItemPreview";
import LocationSelector from "../components/Location";
import GenericButton from "../components/GenericButton";
import { data } from "./data.js";
import { sortData, placeholder } from "./helpers";
import { updateMeetUp, getMeetUp } from "../../service/meetups";
import SwapDetails from "../components/SwapDetails";
import { getUserId, getUser } from "../../service/users";
import { useSearchParams } from 'next/navigation';
import {
  supabase,
  getChats,
  getChat,
  sendMessage,
  getUserIdsFromChat,
  toggleViewed,
} from "../../service/chat";
import ShopModal from "../components/ShopModal";
import ProfileImage from "../components/ProfileImage";
sortData(data);

const ChatPage: React.FC = () => {
  const [currUserId, setCurrUserId] = useState<string | null>(null);
  const [chats, setChats] = useState<Array<{
    id: string;
    created_at: string;
    user1_id: string;
    user2_id: string;
    status: string;
    viewed: boolean;
    profilePic: string;
    username: string;
    latestMessage: {
      created_at: string;
      chat_id: string;
      sender_id: string;
      content: string;
    };
  }> | null>(null);
  const [messages, setMessages] = useState<Array<{
    type: string;
    chat_id: string;
    content: string;
    created_at: string;
    sender_id: string;
  }> | null>(null);
  const [otherUserData, setOtherUserData] = useState<{
    id: string;
    name: string;
    location: string;
    description: string;
    dob: string;
    image: string;
    rating: string;
    num_of_ratings: string;
    swap_count: string;
    blocked: string;
  } | null>(null);
  const [swapId, setSwapId] = useState<string | null>(null);
  const [meetUpInfo, setMeetUpInfo] = useState<{
    location: string;
    date: string;
    time: string;
  } | null>(null);
  const [user, setUser] = useState<any>(null); // State for user
  const [loading, setLoading] = useState(true); // For handling the loading state
  const router = useRouter();
  const [meInput, setMeInput] = useState<string>(""); // Input for sending messages as "Me"
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [accepted, setAccepted] = useState<boolean>(false);
  const messageBoxRef = useRef<HTMLDivElement>(null); // Create a ref for the messageBox
  const otherUserDataRef = useRef(otherUserData);
  const [requesterId, setRequesterId] = useState<string | null>(null);
  const [accepterId, setAccepterId] = useState<string | null>(null);
  const [isSwapDetailsVisible, setIsSwapDetailsVisible] = useState(true); // Manage SwapDetails visibility
  const lastScrollTop = useRef(0); // Track the last scroll position
  const [isUpdateSwapModalVisible, setIsUpdateSwapModalVisible] =
    useState(false); // State to control modal visibility

  const searchParams = useSearchParams();
  
  const fetchChatUsers = async (chatId: string) => {
    const users = await getUserIdsFromChat(chatId);

    if (users) {
      if (currUserId === users.requesterId) {
        setRequesterId(users.accepterId); // Other user's ID
        setAccepterId(users.requesterId); // Your ID
      } else {
        setRequesterId(users.requesterId); // Other user's ID
        setAccepterId(users.accepterId); // Your ID
      }
    } else {
      console.log("No users found for the given chat ID");
    }
  };

  useEffect(() => {
    otherUserDataRef.current = otherUserData;
    // update shop
    // console.log("Other user data: ", otherUserData, otherUserDataRef)
  }, [otherUserData]);

  const sortChats = (
    c: Array<{
      id: string;
      created_at: string;
      user1_id: string;
      user2_id: string;
      status: string;
      viewed: boolean;
      profilePic: string;
      username: string;
      latestMessage: {
        created_at: string;
        chat_id: string;
        sender_id: string;
        content: string;
      };
    }> | null
  ) => {
    if (c) {
      const sortedChats = [...c].sort((a, b) => {
        return (
          new Date(b.latestMessage.created_at).getTime() -
          new Date(a.latestMessage.created_at).getTime()
        );
      });
      // console.log("Sorted chats");
      // console.log(sortedChats);
      return sortedChats;
    }
    return null;
  };

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Messages" },
        (payload) => {
          console.log("Change received!", payload);
          handleInitialDataFetches();
          // console.log("Allan checks: ", otherUserDataRef, payload, activeChat);

          // update messages
          if (
            otherUserDataRef.current != null &&
            payload.new.chat_id == swapId
          ) {
            // console.log("setting messages");
            setMessages((prevMessages) => {
              if (prevMessages != null) {
                const updatedMessages = [
                  ...prevMessages,
                  {
                    type: "text",
                    content: payload.new.content,
                    chat_id: payload.new.chat_id,
                    created_at: payload.new.created_at,
                    sender_id: payload.new.sender_id,
                  },
                ];

                return updatedMessages;
              } else {
                return null;
              }
            });
          } else {
            console.log("not right chat");
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  const handleInitialDataFetches = async (c_id: string | null = null) => {
    const uid = await getUserId();
    setCurrUserId(uid);
    let sortedChats;
    if (uid != null) {
      const c = await getChats(uid);
      sortedChats = sortChats(c);
      setChats(sortedChats);
      if (activeChat !== null) {
        setActiveChat(0);
      }

      const chatId = searchParams.get('chatId'); // Get the chat ID from the URL
      // console.log(chatId, "sigm6888", sortedChats)
      
      if (chatId && sortedChats !== null) {
        const chatIndex = sortedChats.findIndex((chat) => Number(chat.id) === Number(chatId));
        // console.log(chatIndex, "sigm6888")
        if (chatIndex !== -1) {
          switchChat(chatIndex);
        }
      }
    }
  };

  const goToChatWithId = (chatId: string) => {
    if (!chats) return;
  
    
  };
  
  useEffect(() => {
    handleInitialDataFetches();
  }, []);

  const getAllMessages = async (chat_id: string) => {
    const c = await getChat(chat_id);
    setMessages(c);
  };

  async function getMeetUpData(swap_id: string) {
    const meetUpData = await getMeetUp(swap_id);
    // console.log("Fetching meet up data");
    if (meetUpData && meetUpData.length > 0) {
      const new_meet_up_data = {
        location: meetUpData[0].location,
        date: meetUpData[0].date,
        time: meetUpData[0].time,
      };
      // console.log(new_meet_up_data);
      setMeetUpInfo(new_meet_up_data);
    } else {
      console.log("failed to update meet up data poop");
    }
  }

  useEffect(() => {
    // console.log("Current swap id " + swapId);
    // update meet up data
    if (swapId !== null) {
      // console.log("updating meetup data")
      getMeetUpData(swapId);
    } else {
      // console.log("couldnt get swap data! cnt");
      setMeetUpInfo(null);
    }
  }, [swapId]);

  function updateSwapId(chat_id: string) {
    const curr_swap_id = chat_id;
    if (curr_swap_id !== null) {
      // console.log("Got swap id:");
      // console.log(curr_swap_id);
      setSwapId(curr_swap_id);
    } else {
      console.log("epic fail, couldn't find swap id");
      setSwapId(null);
      setMeetUpInfo(null);
    }
  }

  useEffect(() => {
    console.log("Other use data: ", otherUserData);
  }, [otherUserData]);

  async function updateOtherUserData() {
    let other_user_id;
    if (currUserId === requesterId) {
      other_user_id = accepterId;
    } else {
      other_user_id = requesterId; // here
    }
    if (other_user_id !== null) {
      const other_user_data = await getUser(other_user_id);
      // console.log("Other user data: ", other_user_data);

      if (
        chats != null &&
        activeChat != null &&
        other_user_data.Users !== null
      ) {
        //console.log("Updating other use");
        setOtherUserData(other_user_data.Users[0]);
      }
    }
  }

  useEffect(() => {
    updateOtherUserData();
  }, [requesterId, accepterId]);

  useEffect(() => {
    if (chats != null && activeChat != null) {
      // update list of messages
      const chat_id = chats[activeChat].id;
      getAllMessages(chat_id);
      // Fetch and set the UUID (requesterId) for the other user by their username
      fetchChatUsers(chat_id);

      // update current swap id
      updateSwapId(chat_id);

      // update otherUserData
      // updateOtherUserData();
    }
  }, [activeChat]);

  useEffect(() => {
    if (chats != null && chats.length > 0 && activeChat != null) {
     const chat_id = chats[activeChat].id;

      // Fetch messages for the current chat
      getAllMessages(chat_id);

      // Fetch and set the UUID (requesterId) for the other user
      fetchChatUsers(chat_id);

      // Update otherUserData
      updateOtherUserData();
      // setOtherUserData({
      //   name: chats[activeChat].username,
      //   chat_id: chats[activeChat].id,
      // });
    }
  }, [activeChat, chats]); // Ensure this runs whenever activeChat changes

  // Scroll to the bottom of the messageBox when messages change
  useEffect(() => {
    if (messageBoxRef.current) {
      messageBoxRef.current.scrollTop = messageBoxRef.current.scrollHeight;
    }
  }, [messages]);

  const setNotification = (
    notif: string,
    location: string,
    date: string,
    time: string
  ) => {
    const type = "notification";
    // console.log("Updating:", location, date, time);
    updateMeetUp(swapId, location, date, time);
    // send message to chat notifying users that meetup has been updated
    const text =
      "Meetup agreement updated to: " +
      time +
      " on the " +
      date +
      " at " +
      location;
    if (currUserId !== null && swapId !== null) {
      sendMessage(currUserId, swapId, text);
    }
  };

  // Handle sending messages from "Me"
  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    // console.log("aaaaaaaaaaaaaaaaaaaa")
    if (meInput.trim() && activeChat != null) {
      // console.log("bbbbbbbbbbbbbbbbbb")
      if (currUserId != null && swapId !== null) {
        // console.log("cccccccccccccccccccccccccccc")
        sendMessage(currUserId, swapId, meInput);
        setMeInput("");
        setActiveChat(0);
      }
    }
  };

  // Switch active chat
  const switchChat = (chat: number) => {
    setActiveChat(chat);

    // Clear out the requesterId and accepterId before fetching new ones
    setRequesterId(null);
    setAccepterId(null);

    // Fetch new data for the selected chat
    if (chats != null) {
      fetchChatUsers(chats[chat].id);
    }

    setAccepted(false);
  };

  // Toggle selection of a lastMessage preview
  const toggleMessageSelection = (index: number) => {
    if (chats != null) {
      if (chats[index].viewed == false) {
        // set to viewed!!!!
      }
    }
    switchChat(index);
    data[index]["viewed"] = true;
  };



  return (
    <div className="relative">
      {" "}
      {/* The relative container to position the grey overlay */}
      {/* Grey overlay */}
      <div className="flex h-[85vh] bg-gray-100">
        {/* Sidebar for other chats */}
        <div className="flex flex-col w-1/5 py-4 pt-0 border-r overflow-y-auto h-full bg-white">
          <div className="flex items-center text-black font-bold text-3xl p-2 pt-4 m-0 px-4 border h-[10vh] ">
            <h2>Chats</h2>
          </div>
          <div className="flex flex-col h-[75vh] overflow-scroll">
            {chats !== null &&
              chats.map((msg, index) => (
                <div key={index} onClick={() => toggleMessageSelection(index)}>
                  <MessagePreview
                    name={msg.username}
                    lastMessage={msg.latestMessage.content}
                    date={msg.latestMessage.created_at}
                    viewed={msg.viewed}
                    isSelected={activeChat === index} // Pass selection state
                    userId={currUserId == msg.user2_id ? msg.user1_id : msg.user2_id}
                  />
                </div>
              ))}
          </div>
        </div>

        {/* Main chat area */}
        {activeChat !== null && (
          <div
            style={{
              width: "55%",
              // flexGrow: 1,
              display: "flex",
              flexDirection: "column",
              height: "100%", // 'h-full'
              padding: "1rem", // 'p-4' (4 units in Tailwind is usually 1rem)
              position: "relative",
            }}
          >
            {/* SwapDetails */}
            <div
              className={`sticky top-0 bg-white border-b transition-transform duration-300 ${
                isSwapDetailsVisible ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              {activeChat != null && accepterId && requesterId && (
                <SwapDetails ownerId={accepterId} requesterId={requesterId} />
              )}
            </div>

            <div
              ref={messageBoxRef} // Attach the ref here
              id="messageBox"
              className="flex-grow p-4 bg-white rounded-lg shadow-lg overflow-auto relative border"
            >
              {otherUserData != null && (
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
                  This is the start of your chat with {otherUserData.name}
                </div>
              )}
              <div>
                {/* Add padding to prevent overlap */}
                <div className="flex flex-col space-y-2">
                  {messages?.map((msg, index) => {
                    switch (msg.type) {
                      case "text":
                        return (
                          <MessageBubble
                            key={index}
                            sender={msg.sender_id}
                            text={msg.content}
                            uid={currUserId}
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
                              {msg.content}
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
                            {msg.content}
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
          </div>
        )}
        {/* Other users info and meetup info */}
        {activeChat !== null && (
          <div className="flex flex-col flex-grow py-4 pt-0 border-r overflow-y-auto h-full pr-3">
            <div className="w-full bg-white text-black p-4 rounded-lg text-xl flex flex-col items-center mt-4 border">
              {otherUserData !== null ? (
                <div className="flex flex-row items-center justify-evenly w-full mb-4">
                  <ProfileImage userId={otherUserData.id}></ProfileImage>
                  <div className="flex flex-col items-start align-middle">
                    <div>
                      <div className="font-bold overflow-auto text-center">
                        {otherUserData.name}'s Swap Shop
                      </div>
                      {otherUserData !== null ? (
                        <UserRating
                          size="text-sm"
                          rating={Number(otherUserData.rating)}
                          num={Number(otherUserData.num_of_ratings)}
                        ></UserRating>
                      ) : (
                        <UserRating size="text-sm" num={0}></UserRating>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="font-bold overflow-auto text-center">
                  Loading...
                </div>
              )}

              {otherUserData && (
                <ShopModal otherUser={otherUserData}>
                  <GenericButton
                    text="Visit Shop"
                    inverse={true}
                    width="20vw"
                  />
                </ShopModal>
              )}
            </div>

            <div className="w-full bg-white text-black py-4 px-4 rounded-lg flex flex-col items-center mt-4 border">
              <div className="font-bold text-2xl mb-3">Meetup Info</div>
              {meetUpInfo !== null ? (
                <LocationSelector
                  click={(location: string, date: string, time: string) => {
                    setNotification(
                      `You updated the meetup details with ${data[activeChat].name}`,
                      location,
                      date,
                      time
                    );
                  }}
                  meetUpInfo={meetUpInfo}
                  swap_id={swapId}
                />
              ) : (
                <div>
                  Loading... (unless there's a missing swap record in DB...oop!)
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatPage;
