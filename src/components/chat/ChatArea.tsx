"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
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
  Check,
  CheckCheck,
} from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  addMessage,
  setMessages,
  setTyping,
  IMessage,
} from "@/redux/features/chat/chatSlice";
import {
  useGetMessagesByConversationQuery,
  useSendMessageMutation,
} from "@/redux/features/chat/chatApi";
import { getSocket } from "@/lib/socket";
import { Avatar } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export const ChatArea: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId
  );
  const user = useAppSelector((state) => state.auth.user);
  const token = useAppSelector((state) => state.auth.token);
  const people = useAppSelector((state) => state.chat.people);
  const groups = useAppSelector((state) => state.chat.groups);
  const messagesMap = useAppSelector((state) => state.chat.messages);
  const typingUsers = useAppSelector((state) => state.chat.typingUsers);

  const [inputText, setInputText] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const [sendMessageApi] = useSendMessageMutation();

  // Find active contact or group
  const activeChat =
    people.find((p) => p.id === activeConversationId) ||
    groups.find((g) => g.id === activeConversationId);

  const currentMessages = activeConversationId
    ? messagesMap[activeConversationId] || []
    : [];

  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  const isOtherTyping = activeConversationId
    ? !!typingUsers[activeConversationId]
    : false;

  // 1. Fetch historical messages from backend when active conversation changes
  const { data: dbMessagesData } = useGetMessagesByConversationQuery(
    activeConversationId as string,
    {
      skip: !isMounted || !activeConversationId,
      refetchOnMountOrArgChange: true,
    }
  );

  // Sync historical messages into Redux
  useEffect(() => {
    if (activeConversationId && dbMessagesData) {
      const rawList = Array.isArray(dbMessagesData)
        ? dbMessagesData
        : (dbMessagesData as any)?.data || [];

      if (Array.isArray(rawList)) {
        const formatted: IMessage[] = rawList.map((m: any) => ({
          id: m.id,
          conversationId: m.conversationId,
          senderId: m.senderId,
          senderName:
            m.sender?.name || (m.senderId === user?.id ? "You" : "Friend"),
          content: m.content,
          messageType: m.messageType || "TEXT",
          fileUrl: m.fileUrl,
          fileName: m.fileName,
          isRead: m.isRead,
          createdAt: m.createdAt
            ? new Date(m.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })
            : "Recently",
          isOutgoing: m.senderId === user?.id,
        }));

        dispatch(
          setMessages({
            conversationId: activeConversationId,
            messages: formatted,
          })
        );
      }
    }
  }, [activeConversationId, dbMessagesData, user?.id, dispatch]);

  // 2. Join / Leave conversation room via WebSocket
  useEffect(() => {
    if (!activeConversationId || !token) return;
    const socket = getSocket(token);

    socket.emit("joinConversation", { conversationId: activeConversationId });
    socket.emit("markAsRead", { conversationId: activeConversationId });

    return () => {
      socket.emit("leaveConversation", { conversationId: activeConversationId });
    };
  }, [activeConversationId, token]);

  // 3. Listen for incoming messages and typing events in real time
  useEffect(() => {
    if (!token) return;
    const socket = getSocket(token);

    const handleIncomingMessage = (newMsg: any) => {
      if (!newMsg) return;

      const formatted: IMessage = {
        id: newMsg.id,
        conversationId: newMsg.conversationId,
        senderId: newMsg.senderId,
        senderName:
          newMsg.sender?.name ||
          (newMsg.senderId === user?.id ? "You" : "Friend"),
        content: newMsg.content,
        messageType: newMsg.messageType || "TEXT",
        fileUrl: newMsg.fileUrl,
        fileName: newMsg.fileName,
        isRead: newMsg.isRead,
        createdAt: newMsg.createdAt
          ? new Date(newMsg.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })
          : "Just now",
        isOutgoing: newMsg.senderId === user?.id,
      };

      dispatch(addMessage(formatted));

      if (
        activeConversationId === newMsg.conversationId &&
        newMsg.senderId !== user?.id
      ) {
        socket.emit("markAsRead", { conversationId: newMsg.conversationId });
      }
    };

    const handleUserTyping = (data: {
      conversationId: string;
      userId: string;
      isTyping: boolean;
    }) => {
      if (data.userId !== user?.id) {
        dispatch(
          setTyping({
            conversationId: data.conversationId,
            isTyping: data.isTyping,
          })
        );
      }
    };

    socket.on("newMessage", handleIncomingMessage);
    socket.on("userTyping", handleUserTyping);

    return () => {
      socket.off("newMessage", handleIncomingMessage);
      socket.off("userTyping", handleUserTyping);
    };
  }, [token, activeConversationId, user?.id, dispatch]);

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages, isOtherTyping]);

  // Handle typing debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputText(e.target.value);

    if (!activeConversationId || !token) return;
    const socket = getSocket(token);

    socket.emit("typing", {
      conversationId: activeConversationId,
      isTyping: true,
    });

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      socket.emit("typing", {
        conversationId: activeConversationId,
        isTyping: false,
      });
    }, 1500);
  };

  // Send message
  const handleSendMessage = useCallback(async () => {
    if (!inputText.trim() || !activeConversationId) return;

    const content = inputText.trim();
    setInputText("");

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    if (token) {
      getSocket(token).emit("typing", {
        conversationId: activeConversationId,
        isTyping: false,
      });
    }

    const timeString = new Date().toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    const optimisticMsg: IMessage = {
      id: `temp-${Date.now()}`,
      conversationId: activeConversationId,
      senderId: user?.id || "me",
      senderName: user?.name || "You",
      content,
      createdAt: timeString,
      isOutgoing: true,
      isRead: false,
    };

    // Optimistically show message immediately
    dispatch(addMessage(optimisticMsg));

    const socket = getSocket(token || undefined);

    // Send via WebSocket (with REST fallback)
    if (socket && socket.connected) {
      socket.emit("sendMessage", {
        conversationId: activeConversationId,
        content,
        messageType: "TEXT",
      });
    } else {
      try {
        await sendMessageApi({
          conversationId: activeConversationId,
          content,
          messageType: "TEXT",
        }).unwrap();
      } catch (err) {
        console.error("Failed to send message via HTTP fallback:", err);
      }
    }
  }, [inputText, activeConversationId, user?.id, user?.name, token, dispatch, sendMessageApi]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // If no conversation is selected
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
          or search for users by username, email or phone.
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
            className="h-12 w-12 ring-2 ring-slate-100 dark:ring-slate-800"
          />
          <div>
            <h2 className="font-bold text-slate-800 dark:text-slate-100 text-lg leading-tight">
              {activeChat?.name}
            </h2>
            <p className="text-xs text-slate-400 font-medium mt-0.5 flex items-center gap-1.5">
              {isOtherTyping ? (
                <span className="text-[var(--primary)] font-semibold animate-pulse">
                  Typing...
                </span>
              ) : activeChat?.online ? (
                <>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block" />
                  Online
                </>
              ) : (
                `Last seen, ${activeChat?.lastSeen || "recently"}`
              )}
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
      <div className="flex-1 overflow-y-auto py-6 px-1 flex flex-col gap-4">
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
                  "flex flex-col group",
                  isOutgoing ? "items-end" : "items-start"
                )}
              >
                <div
                  className={cn(
                    "px-4.5 py-2.5 text-[14px] sm:text-[15px] font-normal leading-relaxed shadow-xs transition-all max-w-[85%] sm:max-w-md",
                    isOutgoing
                      ? "bg-[var(--primary)] text-white rounded-3xl rounded-br-xs shadow-md shadow-[var(--primary)]/15"
                      : "bg-[#F0F2F5] dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-3xl rounded-tl-xs"
                  )}
                >
                  {msg.content}
                </div>

                {showTimestamp && (
                  <div
                    className={cn(
                      "flex items-center gap-1 text-[11px] text-slate-400 mt-1 px-1",
                      isOutgoing ? "justify-end" : "justify-start"
                    )}
                  >
                    <span>{msg.createdAt}</span>
                    {isOutgoing && (
                      <span title={msg.isRead ? "Seen" : "Sent"}>
                        {msg.isRead ? (
                          <CheckCheck className="w-3.5 h-3.5 text-blue-400 stroke-[2.5]" />
                        ) : (
                          <Check className="w-3 h-3 text-slate-400 stroke-[2.5]" />
                        )}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })
        )}

        {/* Live typing indicator bubble */}
        {isOtherTyping && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic py-1 px-3 bg-slate-100 dark:bg-slate-800/60 rounded-full w-fit">
            <span className="flex gap-1 items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.2s]" />
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--primary)] animate-bounce [animation-delay:0.4s]" />
            </span>
            <span>{activeChat?.name} is typing...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input Bar */}
      <div className="pt-2 shrink-0">
        <div className="bg-[#F0F2F5] dark:bg-slate-800 rounded-full p-2 pl-4 flex items-center gap-3 border border-transparent dark:border-slate-700/50 focus-within:border-[var(--primary)]/50 transition-colors">
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
            onChange={handleInputChange}
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
