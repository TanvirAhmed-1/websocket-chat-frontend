"use client";

import React, { useState, useEffect } from "react";
import { Search, CheckCheck, X, UserPlus, AtSign, Phone, Mail, Loader2, MessageSquarePlus } from "lucide-react";
import toast from "react-hot-toast";
import { useAppDispatch, useAppSelector } from "@/redux/hook";
import {
  setActiveConversation,
  setSearchQuery,
  IConversationItem,
  setConversations,
} from "@/redux/features/chat/chatSlice";
import {
  useLazySearchUsersQuery,
  useStartConversationMutation,
} from "@/redux/features/chat/chatApi";
import { Avatar } from "@/components/ui/avatar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

export const ConversationSidebar: React.FC = () => {
  const dispatch = useAppDispatch();
  const activeConversationId = useAppSelector(
    (state) => state.chat.activeConversationId
  );
  const searchQuery = useAppSelector((state) => state.chat.searchQuery);
  const groups = useAppSelector((state) => state.chat.groups);
  const people = useAppSelector((state) => state.chat.people);

  const [triggerSearch, { data: apiSearchResults, isFetching }] =
    useLazySearchUsersQuery();
  const [startConversation] = useStartConversationMutation();

  const [localSearchResults, setLocalSearchResults] = useState<any[]>([]);

  // Trigger search on debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setLocalSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      try {
        const res = await triggerSearch(searchQuery.trim()).unwrap();
        if (Array.isArray(res)) {
          setLocalSearchResults(res);
        } else if (res?.data && Array.isArray(res.data)) {
          setLocalSearchResults(res.data);
        }
      } catch {
        // Fallback search across known contacts if backend is unreachable
        const q = searchQuery.toLowerCase().trim();
        const matches = people.filter(
          (p) =>
            p.name.toLowerCase().includes(q) ||
            p.id.toLowerCase().includes(q)
        );
        setLocalSearchResults(matches);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery, triggerSearch, people]);

  // Click on a searched user -> Start / Select conversation
  const handleSelectSearchedUser = async (user: any) => {
    const existingChat = people.find(
      (p) => p.id === user.id || p.name === user.name
    );

    if (existingChat) {
      dispatch(setActiveConversation(existingChat.id));
      dispatch(setSearchQuery(""));
      toast.success(`Opened chat with ${existingChat.name}`);
      return;
    }

    // Try backend start-conversation
    try {
      const res = await startConversation({ recipientId: user.id }).unwrap();
      const conversationId = res?.id || res?.conversationId || user.id;

      const newContact: IConversationItem = {
        id: conversationId,
        isGroup: false,
        name: user.name,
        avatar: user.image || user.avatarUrl || "",
        lastMessage: "Conversation started",
        time: "Just now",
        isRead: true,
        online: true,
      };

      dispatch(setConversations({ people: [newContact, ...people] }));
      dispatch(setActiveConversation(conversationId));
      dispatch(setSearchQuery(""));
      toast.success(`Started chat with ${user.name}!`);
    } catch {
      // Local fallback
      const newContact: IConversationItem = {
        id: user.id || `user-${Date.now()}`,
        isGroup: false,
        name: user.name,
        avatar: user.image || user.avatarUrl || "",
        lastMessage: "Conversation started",
        time: "Just now",
        isRead: true,
        online: true,
      };

      dispatch(setConversations({ people: [newContact, ...people] }));
      dispatch(setActiveConversation(newContact.id));
      dispatch(setSearchQuery(""));
      toast.success(`Started chat with ${user.name}!`);
    }
  };

  const renderConversationItem = (item: IConversationItem) => {
    const isActive = activeConversationId === item.id;

    return (
      <div
        key={item.id}
        onClick={() => dispatch(setActiveConversation(item.id))}
        className={cn(
          "flex items-center gap-3 p-2.5 rounded-2xl transition-all cursor-pointer select-none group",
          isActive
            ? "bg-slate-100/80 dark:bg-slate-800/90 shadow-xs"
            : "hover:bg-slate-50/80 dark:hover:bg-slate-800/40"
        )}
      >
        {/* Avatar on Left for Conversation List */}
        <Avatar
          src={item.avatar}
          alt={item.name}
          fallback={item.name ? item.name.slice(0, 2).toUpperCase() : "U"}
          size="md"
          online={item.online}
          className="h-11 w-11 shrink-0"
        />

        {/* Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <span className="font-semibold text-slate-800 dark:text-slate-100 text-[13px] sm:text-sm truncate">
              {item.name}
            </span>
            <span className="text-[11px] text-slate-400 whitespace-nowrap">
              {item.time}
            </span>
          </div>

          <div className="flex items-center justify-between gap-2 mt-0.5">
            <p className="text-xs text-slate-400 truncate max-w-[130px] sm:max-w-[160px]">
              {item.lastMessage}
            </p>

            {/* Read status / Unread badge */}
            <div className="shrink-0 flex items-center">
              {item.unreadCount && item.unreadCount > 0 ? (
                <span className="flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-[#22C55E] text-white text-[10px] font-bold">
                  {item.unreadCount}
                </span>
              ) : item.isRead ? (
                <CheckCheck className="w-4 h-4 text-[var(--primary)] stroke-[2.4]" />
              ) : null}
            </div>
          </div>
        </div>
      </div>
    );
  };

  const isSearchActive = searchQuery.trim().length > 0;
  const displayResults =
    Array.isArray(apiSearchResults) && apiSearchResults.length > 0
      ? apiSearchResults
      : localSearchResults;

  return (
    <div className="flex flex-col gap-4 w-full md:w-80 lg:w-96 shrink-0 h-full overflow-y-auto pr-1">
      {/* 1. Search Bar (Dark/Light pill styling as in screenshot) */}
      <div className="relative">
        <div className="bg-white dark:bg-[#151C2C] rounded-2xl sm:rounded-3xl px-4 py-3 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-slate-800/80 flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400 shrink-0 stroke-[2.2]" />
          <input
            type="text"
            placeholder="Search by username, email or phone..."
            value={searchQuery}
            onChange={(e) => dispatch(setSearchQuery(e.target.value))}
            className="w-full bg-transparent border-none text-sm text-slate-700 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none"
          />
          {searchQuery && (
            <button
              onClick={() => dispatch(setSearchQuery(""))}
              className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          {isFetching && (
            <Loader2 className="w-4 h-4 text-[var(--primary)] animate-spin shrink-0" />
          )}
        </div>
      </div>

      {/* 2. When searching: Show Found Users (Left: Name & details, Right: Image) */}
      {isSearchActive ? (
        <Card className="bg-white dark:bg-[#151C2C] rounded-3xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-slate-800/80 flex-1 flex flex-col overflow-hidden">
          <CardHeader className="p-1 pb-3 flex flex-row items-center justify-between">
            <CardTitle className="text-sm font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <UserPlus className="w-4 h-4 text-[var(--primary)]" /> Search Results
            </CardTitle>
            <span className="text-[11px] text-slate-400">
              {displayResults.length} found
            </span>
          </CardHeader>

          <CardContent className="p-0 flex flex-col gap-2 overflow-y-auto">
            {displayResults.length > 0 ? (
              displayResults.map((user: any) => (
                <div
                  key={user.id}
                  onClick={() => handleSelectSearchedUser(user)}
                  className="p-3 rounded-2xl border border-slate-100 dark:border-slate-800/80 bg-slate-50/60 dark:bg-slate-800/40 hover:bg-purple-50/50 dark:hover:bg-purple-950/20 hover:border-[var(--primary)]/40 transition-all flex items-center justify-between gap-3 cursor-pointer group shadow-2xs"
                >
                  {/* LEFT SIDE: Name, Username, Phone/Email */}
                  <div className="flex-1 min-w-0 pr-2">
                    <div className="flex items-center gap-2">
                      <h4 className="font-bold text-slate-900 dark:text-slate-100 text-sm truncate group-hover:text-[var(--primary)] transition-colors">
                        {user.name}
                      </h4>
                      {user.username && (
                        <span className="text-[11px] font-mono text-[var(--primary)] bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-md font-semibold">
                          @{user.username}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-col gap-0.5 mt-1 text-[11px] text-slate-400">
                      {user.email && (
                        <span className="flex items-center gap-1 truncate">
                          <Mail className="w-3 h-3 shrink-0" /> {user.email}
                        </span>
                      )}
                      {user.phone && (
                        <span className="flex items-center gap-1 truncate font-mono">
                          <Phone className="w-3 h-3 shrink-0" /> {user.phone}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* RIGHT SIDE: User Image / Avatar */}
                  <div className="shrink-0 flex items-center gap-2">
                    <Avatar
                      src={user.image || user.avatarUrl}
                      alt={user.name}
                      fallback={user.name ? user.name.slice(0, 2).toUpperCase() : "U"}
                      size="md"
                      online={user.isActive ?? true}
                      className="h-11 w-11 ring-2 ring-slate-200 dark:ring-slate-700 group-hover:ring-[var(--primary)] transition-all"
                    />
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 group-hover:bg-[var(--primary)] group-hover:text-white text-slate-400 flex items-center justify-center transition-all">
                      <MessageSquarePlus className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="py-8 text-center text-slate-400 text-xs flex flex-col items-center gap-2">
                <Search className="w-7 h-7 text-slate-300 dark:text-slate-700" />
                <p>No users found matching &quot;{searchQuery}&quot;</p>
                <p className="text-[11px] text-slate-500">
                  Try searching by exact phone, email or @username
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        /* Normal State: Groups & People Lists */
        <>
          {/* Groups Section Card */}
          <Card className="bg-white dark:bg-[#151C2C] rounded-3xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-slate-800/80">
            <CardHeader className="p-1 pb-2">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                Groups
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-1">
              {groups.length > 0 ? (
                groups.map(renderConversationItem)
              ) : (
                <p className="text-xs text-slate-400 p-2">No groups yet</p>
              )}
            </CardContent>
          </Card>

          {/* People Section Card */}
          <Card className="bg-white dark:bg-[#151C2C] rounded-3xl p-4 shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] dark:shadow-none border border-transparent dark:border-slate-800/80 flex-1">
            <CardHeader className="p-1 pb-2">
              <CardTitle className="text-base font-bold text-slate-800 dark:text-slate-100">
                People
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 flex flex-col gap-1 overflow-y-auto">
              {people.length > 0 ? (
                people.map(renderConversationItem)
              ) : (
                <p className="text-xs text-slate-400 p-2">
                  No conversations yet. Use the search bar above to find users by username, phone or email!
                </p>
              )}
            </CardContent>
          </Card>
        </>
      )}
    </div>
  );
};
