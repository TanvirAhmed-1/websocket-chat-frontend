import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface IMessage {
  id: string;
  conversationId: string;
  senderId: string;
  senderName?: string;
  content: string;
  messageType?: "TEXT" | "IMAGE" | "FILE" | "AUDIO" | "VIDEO";
  fileUrl?: string;
  fileName?: string;
  isRead?: boolean;
  createdAt: string;
  isOutgoing?: boolean;
}

export interface IConversationItem {
  id: string;
  isGroup: boolean;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isRead?: boolean;
  online?: boolean;
  lastSeen?: string;
}

export interface IChatState {
  activeNavTab: "home" | "chat" | "notifications" | "settings" | "profile";
  activeConversationId: string | null;
  searchQuery: string;
  groups: IConversationItem[];
  people: IConversationItem[];
  messages: Record<string, IMessage[]>;
  typingUsers: Record<string, boolean>; // conversationId -> isTyping
}

const initialState: IChatState = {
  activeNavTab: "chat",
  activeConversationId: null,
  searchQuery: "",
  groups: [],
  people: [],
  messages: {},
  typingUsers: {},
};

const chatSlice = createSlice({
  name: "chat",
  initialState,
  reducers: {
    setActiveNavTab: (
      state,
      action: PayloadAction<"home" | "chat" | "notifications" | "settings" | "profile">
    ) => {
      state.activeNavTab = action.payload;
    },
    setActiveConversation: (state, action: PayloadAction<string | null>) => {
      state.activeConversationId = action.payload;
      if (action.payload) {
        // Mark as read in lists
        const p = state.people.find((item) => item.id === action.payload);
        if (p) p.unreadCount = 0;
        const g = state.groups.find((item) => item.id === action.payload);
        if (g) g.unreadCount = 0;
      }
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    addMessage: (state, action: PayloadAction<IMessage>) => {
      const { conversationId } = action.payload;
      if (!state.messages[conversationId]) {
        state.messages[conversationId] = [];
      }
      state.messages[conversationId].push(action.payload);

      // Update last message in list
      const p = state.people.find((item) => item.id === conversationId);
      if (p) {
        p.lastMessage = action.payload.content;
        p.time = action.payload.createdAt;
      }
      const g = state.groups.find((item) => item.id === conversationId);
      if (g) {
        g.lastMessage = action.payload.content;
        g.time = action.payload.createdAt;
      }
    },
    setTyping: (
      state,
      action: PayloadAction<{ conversationId: string; isTyping: boolean }>
    ) => {
      state.typingUsers[action.payload.conversationId] = action.payload.isTyping;
    },
    setConversations: (
      state,
      action: PayloadAction<{ groups?: IConversationItem[]; people?: IConversationItem[] }>
    ) => {
      if (action.payload.groups) state.groups = action.payload.groups;
      if (action.payload.people) state.people = action.payload.people;
    },
    setMessages: (
      state,
      action: PayloadAction<{ conversationId: string; messages: IMessage[] }>
    ) => {
      state.messages[action.payload.conversationId] = action.payload.messages;
    },
    clearAllChatData: (state) => {
      state.groups = [];
      state.people = [];
      state.messages = {};
      state.activeConversationId = null;
    },
  },
});

export const {
  setActiveNavTab,
  setActiveConversation,
  setSearchQuery,
  addMessage,
  setTyping,
  setConversations,
  setMessages,
  clearAllChatData,
} = chatSlice.actions;

export default chatSlice.reducer;
