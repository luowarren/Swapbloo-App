"use client"; // This marks the component as a Client Component

import React, { useState, FormEvent, useRef, useEffect } from "react";
import MessageBubble from "../components/MessageBubble";
import UserRating from "../components/UserRating";
import { useRouter } from "next/navigation"; // Next.js router for redirection
import LocationSelector from "../components/Location";
import GenericButton from "../components/GenericButton";
import { updateMeetUp, getMeetUp } from "../../service/meetups";
import SwapDetails from "../components/SwapDetails";
import { getUserId, getUser } from "../../service/users";
import { useSearchParams } from "next/navigation";
import { supabase } from "../../service/supabaseClient";
import {
  getChats,
  getChat,
  sendMessage,
  getUserIdsFromChat,
  toggleViewed,
  setChatConsented,
} from "../../service/chat";
import ShopModal from "../components/ShopModal";
import ProfileImage from "../components/ProfileImage";
import { ChevronLeft, MessageCircleDashed, Send, Shirt, Star } from "lucide-react";
import { getSwapDetailsBetweenUsers } from "@/service/swaps";
import { getAllBlocked } from "../../service/block";
import MessagePreview from "../components/MessagePreview";

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
    consented: boolean;
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
    chat_id: string;
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
  const [consented, setConsented] = useState(false); // For handling the loading state
  const router = useRouter();
  const [meInput, setMeInput] = useState<string>(""); // Input for sending messages as "Me"
  const [activeChat, setActiveChat] = useState<number | null>(null);
  const [accepted, setAccepted] = useState<boolean>(false);
  const messageBoxRef = useRef<HTMLDivElement>(null); // Create a ref for the messageBox
  const swapIdRef = useRef(swapId);
  const [requesterId, setRequesterId] = useState<string | null>(null);
  const [accepterId, setAccepterId] = useState<string | null>(null);
  const [isSwapDetailsVisible, setIsSwapDetailsVisible] = useState(true); // Manage SwapDetails visibility
  const lastScrollTop = useRef(0); // Track the last scroll position
  const [isUpdateSwapModalVisible, setIsUpdateSwapModalVisible] =
    useState(false); // State to control modal visibility

  const searchParams = useSearchParams();

  const truncateMessage = (msg: string, maxLength: number) => {
    return msg.length > maxLength ? msg.slice(0, maxLength) + "..." : msg;
  };

  // check if user logged in!
  useEffect(() => {
    const checkUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!data?.user) {
        router.push("/login"); // Redirect to /login if no user is found
      }
    };
    checkUser();
  }, [router]);

  const sortMessagesByTime = (
    messagesArray: Array<{
      type: string;
      chat_id: string;
      content: string;
      created_at: string;
      sender_id: string;
    }>
  ) => {
    return messagesArray.sort(
      (a, b) =>
        new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
    );
  };

  const fetchChatUsers = async (chatId: string) => {
    const users = await getUserIdsFromChat(chatId);
    if (users) {
      const { swapExists, user1Items, user2Items, swapId, status, swap } =
        await getSwapDetailsBetweenUsers(users?.accepterId, users?.requesterId);
        console.log("got swap details, ", status)
        setAccepted(status === "Accepted");

      if (swap) {
        setRequesterId(swap.requester_id); // Other user's ID
        setAccepterId(swap.accepter_id); // Your ID
      }
    }
  };

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

      return sortedChats;
    }
    return null;
  };

  useEffect(() => {
    swapIdRef.current = swapId;
  }, [swapId]);

  useEffect(() => {
    const channel = supabase
      .channel("chat-room")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "Messages" },
        (payload) => {
          console.log("Change received!", payload, activeChat);
         
          // update messages
          if (
            swapIdRef.current !== null &&
            payload.new.chat_id == swapIdRef.current
          ) {
            setMessages((prevMessages) => {
              let updatedMessages =
                prevMessages !== null ? [...prevMessages] : [];
              updatedMessages.push({
                type: "text",
                content: payload.new.content,
                chat_id: payload.new.chat_id,
                created_at: payload.new.created_at,
                sender_id: payload.new.sender_id,
              });
              return updatedMessages;
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

  useEffect(() => {
    if (messages !== null) {
      const sortedMessages = sortMessagesByTime(messages);
      console.log("sorted messages", sortedMessages);
      setMessages(sortedMessages);
    }
  }, [messages]);

  function isBlocked(blocked: any[] | undefined, chat: any) {
    if (!chat || !blocked) {
      return false;
    }
    if (
      blocked.find(
        (b) => b.blockee === chat.user1_id || b.blockee === chat.user2_id
      )
    ) {
      return true;
    }
    return false;
  }

  const handleInitialDataFetches = async () => {
    const uid = await getUserId();
    setCurrUserId(uid);
    if (uid != null) {
      const blocked = await getAllBlocked(uid);
      const allChats = (await getChats(uid)).filter(
        (c) => !isBlocked(blocked, c)
      );
      const sortedChats = sortChats(allChats);
      setChats(sortedChats);
      if (activeChat !== null) {
        setActiveChat(0);
      }
      return sortedChats;
    }
    return [];
  };

  
  const goToChatWithId = (chatId: string) => {
    if (!chats) return;
  };

  useEffect(() => {
    // Create an async function inside the useEffect hook
    const fetchData = async () => {
      let sortedChats = await handleInitialDataFetches();
  
      const chatId = searchParams.get("chatId"); // Get the chat ID from the URL
  
      if (chatId && sortedChats !== null) {
        const chatIndex = sortedChats.findIndex(
          (chat) => Number(chat.id) === Number(chatId)
        );
        if (chatIndex !== -1) {
          switchChat(chatIndex);
        }
      }
    };
  
    // Call the async function
    fetchData();
  }, [searchParams]); // You should add searchParams or any other dependencies
  

  const getAllMessages = async (chat_id: string) => {
    const texts = await getChat(chat_id);
    setMessages(texts);
  };

  async function getMeetUpData(swap_id: string) {
    const meetUpData = await getMeetUp(swap_id);
    console.log("Fetching meet up data");
    if (meetUpData && meetUpData.length > 0) {
      const new_meet_up_data = {
        location: meetUpData[0].location,
        date: meetUpData[0].date,
        time: meetUpData[0].time,
      };
      console.log(new_meet_up_data);
      setMeetUpInfo(new_meet_up_data);
    } else {
      console.log("failed to update meet up data poop");
    }
  }

  useEffect(() => {
    console.log("Current swap id " + swapId);
    // update meet up data
    if (swapId !== null) {
      // console.log("updating meetup data")
      getMeetUpData(swapId);
    } else {
      setMeetUpInfo(null);
    }
  }, [swapId]);

  async function updateOtherUserData() {
    let other_user_id;
    console.log("alfjnwasfklujbwsolfjkdb", currUserId, requesterId);
    if (currUserId === requesterId) {
      other_user_id = accepterId;
    } else {
      other_user_id = requesterId; // here
    }
    if (other_user_id !== null) {
      const other_user_data = await getUser(other_user_id);
      console.log("Other user data: ", other_user_data);

      if (
        chats != null &&
        activeChat != null &&
        other_user_data.Users !== null
      ) {
        console.log("Updating other use");
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
      console.log("setting swap id", chat_id);
      setSwapId(chat_id);

      // update otherUserData
      // updateOtherUserData();
      console.log("adeline", chats[activeChat].id);

      setConsented(chats[activeChat].consented);
    }
  }, [activeChat]);

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
    console.log("Updating:", location, date, time);
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
      handleInitialDataFetches();
    }
  };

  const handleSend = (e: FormEvent) => {
    e.preventDefault();
    if (meInput.trim() && activeChat != null) {
      if (currUserId != null && swapId !== null) {
        sendMessage(currUserId, swapId, meInput);
        setMeInput("");
        handleInitialDataFetches();
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
  };

  // Toggle selection of a lastMessage preview
  const toggleMessageSelection = async (index: number) => {
    if (chats != null) {
      if (
        chats[index] &&
        chats[index].viewed == false &&
        chats[index].latestMessage.sender_id !== currUserId
      ) {
        // set to viewed!!!!
        console.log("toggling viewed!!");
        await toggleViewed(chats[index].id);
      }
    }
    switchChat(index);
  };

  function updateAccepted(status: boolean) {
    setAccepted(status);
  }

  return (
    <div className="relative">
      {/* The relative container to position the grey overlay */}
      {/* Grey overlay */}
      <div className="flex h-[92vh]">
        {/* Sidebar for other chats */}
        <div className="flex flex-col w-1/5 py-2 pt-0 border-r overflow-y-auto h-full bg-white">
          <div
            className="flex items-center gap-1 rounded-sm py-1 px-2 bg-gray-100 w-fit text-gray-600 font-medium mt-2 ml-4 hover:bg-gray-200 transition cursor-pointer"
            onClick={() => {
              router.push("/listings");
            }}
          >
            <ChevronLeft className="h-4 w-4" />
            Go Back
          </div>
          <div className="flex items-center text-indigo-600 italic font-bold text-2xl m-0 px-4 py-2">
            <h2>Chats</h2>
          </div>
          <div className="flex flex-col h-[100vh] overflow-scroll mb-[25vh]">
            {chats === null && (
              <div className="h-[80vh] flex items-center justify-center">
                <div className="animate-spin [animation-duration:500ms]">
                  <Shirt className="text-indigo-600 stroke-[2.5px]" />
                </div>
              </div>
            )}

            {chats !== null &&
              (chats.length == 0 ? (
                <div className="mx-4 flex flex-col gap-2 items-center py-4 p-10 text-center border rounded-t-lg border-dashed text-gray-500 text-sm border-gray-300 font-medium">
                  <MessageCircleDashed className="w-7 h-7 text-gray-400" />
                  You have no chats! Initiate a swap in listings to start
                  chatting!
                </div>
              ) : (
                chats.map((msg, index) => (
                  <div
                    key={index}
                    onClick={() => toggleMessageSelection(index)}
                  >
                    <MessagePreview
                      name={msg.username}
                      lastMessage={msg.latestMessage.content}
                      date={msg.latestMessage.created_at}
                      viewed={
                        msg.latestMessage.sender_id === currUserId
                          ? true
                          : msg.viewed
                      }
                      isSelected={activeChat === index} // Pass selection state
                      userId={
                        currUserId == msg.user2_id ? msg.user1_id : msg.user2_id
                      }
                    />
                  </div>
                ))
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
              position: "relative",
            }}
            className="pb-[75px]"
          >
            {/* SwapDetails */}
            <div
              className={`sticky top-0 border-b border-gray-300 transition-transform duration-300 ${
                isSwapDetailsVisible ? "translate-y-0" : "-translate-y-full"
              }`}
            >
              {activeChat != null && accepterId && requesterId && (
                <SwapDetails ownerId={accepterId} requesterId={requesterId} updateAccepted={updateAccepted} />
              )}
            </div>

            {/* CHAT AREA */}
            <div
              ref={messageBoxRef} // Attach the ref here
              id="messageBox"
              className="flex-grow px-6 pt-2 overflow-auto relative"
            >
              {otherUserData != null && (
                <div
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    color: "gray",
                    marginBottom: "7px",
                  }}
                >
                  <p style={{ paddingBottom: "10px" }}>
                    This is the start of your chat with {otherUserData.name}
                  </p>
                  {!consented && chats && accepterId == currUserId && (
                    <GenericButton
                      text="Start Chatting!"
                      click={() => {
                        setConsented(true);
                        setChatConsented(chats[activeChat].id);
                      }}
                      inverse={true}
                      fontSize="1.5rem"
                    ></GenericButton>
                  )}
                  {!consented && chats && requesterId == currUserId && (
                    <p style={{ paddingBottom: "10px" }}>
                      Wait for {otherUserData.name} to consent before you start
                      chatting
                    </p>
                  )}
                </div>
              )}
              <div>
                {/* Add padding to prevent overlap */}
                <div className="flex flex-col space-y-2">
                  {messages !== null &&
                    messages.map((msg, index) => {
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
                        // case "accept":
                        //   console.log(accepted);
                        //   return (

                        //   );
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
                    {(accepted) && (
                      <div className="flex flex-row items-center justify-center w-full">
                      <div className="flex flex-col gap-1 items-center text-sm justify-center border p-4 py-6 border-dashed rounded border-gray-300 text-gray-500 ">
                        <Star className="w-7 h-7 text-gray-400" />
                          Help make Swapbloo better!
                        <div className="h-2"/>
                        {/* <GenericButton text="Leave a review!" width="15vw" click={leaveReview} /> */}
                         <UserRating
                          size="text-sm"
                          num={-1}
                          otherUser={otherUserData?.id}
                          func={true}
                        ></UserRating> 
                      </div>
                    </div>
                    )
                    }
                </div>
              </div>
            </div>

            {/* Form for sending messages as "Me" */}
            {consented ? (
              <form
                onSubmit={handleSend}
                className="flex mt-4 absolute bottom-5 w-[98%] mx-2"
              >
                <input
                  type="text"
                  value={meInput}
                  onChange={(e) => {
                    setMeInput(e.target.value);
                  }}
                  className="flex-grow p-2 border border-gray-200 text-black rounded-md mr-2"
                  placeholder="Type your message..."
                />
                <button
                  type="submit"
                  className="text-m bg-[#C7D2FE] text-indigo-800 hover:bg-indigo-200 py-2 pl-5 pr-5 rounded-md"
                >
                  <Send />
                </button>
              </form>
            ) : null}
          </div>
        )}
        {/* Other users info and meetup info */}
        {activeChat !== null && (
          <div className="flex flex-col flex-grow py-4 pt-0 border-l border-gray-300 overflow-y-auto h-full">
            <div className="w-full bg-white text-black p-4 text-xl flex flex-col items-center mt-4 border-b border-gray-300">
              {otherUserData !== null ? (
                <div className="flex flex-row items-start w-full ml-6 mb-4">
                  <ProfileImage userId={otherUserData.id}></ProfileImage>
                  <div className="flex flex-col ml-5 items-start align-middle">
                    <div>
                      <div className="font-bold overflow-auto">
                        {truncateMessage(`${otherUserData.name}`, 20)}
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

              {otherUserData !== null && (
                <ShopModal currUser={currUserId} otherUser={otherUserData} origin="chats">
                  <GenericButton
                    text="Visit Shop"
                    inverse={true}
                    width="27vw"
                  />
                </ShopModal>
              )}
            </div>

            <div className="w-full text-black py-4 px-4 flex flex-col items-center mt-4">
              <div className="font-bold text-2xl mb-3">Meetup Info</div>
              {meetUpInfo !== null ? (
                <LocationSelector
                  click={(location: string, date: string, time: string) => {
                    setNotification(
                      `You updated the meetup details with ${otherUserData?.name}`,
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
