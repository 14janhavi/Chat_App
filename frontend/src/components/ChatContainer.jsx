import { useEffect, useRef } from "react";
import { useChatStore } from "../store/useChatStore";
import useAuthStore from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages = [],
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();

  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    if (!selectedUser) return;

    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => unsubscribeFromMessages();
  }, [selectedUser]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput />
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      <ChatHeader />

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {Array.isArray(messages) &&
          messages.map((msg) => (
            <div
              key={msg._id}
              ref={messageEndRef}
              className={`chat ${
                msg.senderId === authUser?._id ? "chat-end" : "chat-start"
              }`}
            >
              <div className="chat-bubble">
                {msg.text && <p>{msg.text}</p>}
                <time className="text-xs opacity-50">
                  {formatMessageTime(msg.createdAt)}
                </time>
              </div>
            </div>
          ))}
      </div>

      <MessageInput />
    </div>
  );
};

export default ChatContainer;
