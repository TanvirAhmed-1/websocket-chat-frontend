"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Phone,
  Video,
  MoreVertical,
  Paperclip,
  Smile,
  Camera,
  Mic,
  Send,
  MessageSquareDashed,
  MessagesSquare,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import { addMessage, IMessage } from "@/redux/features/chat/chatSlice";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ChatArea: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId
  );
  const user = useAppSelector((state) => state.auth.user);
  const people = useAppSelector((state) => state.chat.people);
  const groups = useAppSelector((state) => state.chat.groups);
  const messagesMap = useAppSelector((state) => state.chat.messages);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Find active contact or group
  const activeChat =
    people.find((p) => p.id === activeConversationId) ||
    groups.find((g) => g.id === activeConversationId);

  const currentMessages = activeConversationId
    ? messagesMap[activeConversationId] || []
    : [];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !activeConversationId) return;

    const timeString = `Today, ${new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    })}`;

    const newMsg: IMessage = {
      id: `msg-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user?.id || "me",
      senderName: user?.name || "Me",
      content: inputText.trim(),
      createdAt: timeString,
      isOutgoing: true,
    };

    dispatch(addMessage(newMsg));
    setInputText("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no conversation is selected or list is empty
  if (!activeChat) {
    return (
      <Card className="flex-1 bg-white dark:bg-[#151C2C] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-transparent dark:border-slate-800/80 flex flex-col items-center justify-center text-center h-full min-w-0">
        <div className="w-16 h-16 rounded-3xl bg-purple-50 dark:bg-purple-950/60 text-[var(--primary)] flex items-center justify-center mb-4 shadow-sm">
          <MessagesSquare className="w-8 h-8 stroke-[1.8]" />
        </div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">
          No Active Conversation
        </h3>
        <p className="text-xs sm:text-sm text-slate-400 max-w-sm mt-1.5 leading-relaxed">
          Select a contact or group from the list on the left to start live messaging,
          or use search to find a colleague.
        </p>
      </Card>
    );
  }

  return (
    <Card className="flex-1 bg-white dark:bg-[#151C2C] rounded-3xl p-6 shadow-[0_4px_24px_-4px_rgba(0,0,0,0.05)] dark:shadow-none border border-transparent dark:border-slate-800/80 flex flex-col h-full min-w-0">
      {/* Chat Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 shrink-0">
        <div className="flex items-center gap-3.5">
          <Avatar
            src={activeChat?.avatar}
            alt={activeChat?.name}
            fallback={activeChat?.name?.slice(0, 2) || "U"}
            online={activeChat?.online}
            size="lg"
            className="h-12 w-12"
          />
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">
              {activeChat?.name}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5">
              {activeChat?.online
                ? `Online - Last seen, ${activeChat.lastSeen || "recently"}`
                : `Last seen, ${activeChat?.lastSeen || "recently"}`}
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-2 sm:gap-4 text-[var(--primary)]">
          <button
            title="Voice Call"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Phone className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            title="Video Call"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <Video className="w-5 h-5 stroke-[2.2]" />
          </button>
          <button
            title="More Options"
            className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-full transition-colors cursor-pointer"
          >
            <MoreVertical className="w-5 h-5 stroke-[2.2]" />
          </button>
        </div>
      </div>

      {/* Messages Thread Container */}
      <div className="flex-1 overflow-y-auto py-6 px-1 flex flex-col gap-5">
        {currentMessages.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-slate-400 text-xs sm:text-sm gap-2">
            <MessageSquareDashed className="w-8 h-8 text-slate-300 dark:text-slate-700" />
            <p>No messages yet. Say hello to begin the chat!</p>
          </div>
        ) : (
          currentMessages.map((msg, index) => {
            const isOutgoing = msg.isOutgoing;
            const nextMsg = currentMessages[index + 1];
            const showTimestamp =
              !nextMsg || nextMsg.isOutgoing !== isOutgoing;

            return (
              <div
                key={msg.id}
                className={cn(
                  "flex flex-col",
                  isOutgoing ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "px-5 py-3 text-[14px] sm:text-[15px] font-normal leading-relaxed shadow-xs transition-all max-w-[85%] sm:max-w-md",
                    isOutgoing
                      ? "bg-[var(--primary)] text-white rounded-3xl rounded-br-xs shadow-md shadow-[var(--primary)]/15"
                      : "bg-[#F0F2F5] dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl rounded-tl-xs"
                  )}
                >
                  {msg.content}
                </div>

                {showTimestamp && (
                  <span
                    className={cn(
                      "text-[11px] text-slate-400 mt-1 px-1",
                      isOutgoing ? "text-right" : "text-left"
                    )}
                  >
                    {msg.createdAt}
                  </span>
                )}
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="pt-2 shrink-0">
        <div className="bg-[#F0F2F5] dark:bg-slate-800 rounded-full p-2 pl-4 flex items-center gap-3">
          {/* Attachment Clip */}
          <button
            title="Attach file"
            className="text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors p-1 cursor-pointer"
          >
            <Paperclip className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Input field */}
          <input
            type="text"
            placeholder="Type your message here..."
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1 bg-transparent border-none text-[14px] sm:text-[15px] text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none"
          />

          {/* Emoji button */}
          <button
            title="Emoji"
            className="text-[var(--primary)] hover:opacity-80 transition-opacity p-1 cursor-pointer"
          >
            <Smile className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Camera button */}
          <button
            title="Camera"
            className="text-[var(--primary)] hover:opacity-80 transition-opacity p-1 cursor-pointer"
          >
            <Camera className="w-5 h-5 stroke-[2.2]" />
          </button>

          {/* Mic or Send Action button */}
          <button
            onClick={inputText.trim() ? handleSendMessage : undefined}
            title={inputText.trim() ? "Send message" : "Record voice note"}
            className="bg-[var(--primary)] hover:opacity-90 active:scale-95 text-white p-3 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer"
          >
            {inputText.trim() ? (
              <Send className="w-5 h-5 stroke-[2.4] ml-0.5" />
            ) : (
              <Mic className="w-5 h-5 stroke-[2.2]" />
            )}
          </button>
        </div>
      </div>
    </Card>
  );
};
