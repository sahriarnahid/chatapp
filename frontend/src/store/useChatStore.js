import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
  messages: [],
  users: [],
  selectedUser: null,
  isUsersLoading: false,
  isMessagesLoading: false,
  searchQuery: "",
  unreadMessages: {},
  lastMessageData: {},

  getUsers: async () => {
    set({ isUsersLoading: true });
    try {
      const authUser = useAuthStore.getState().authUser;
      if (!authUser) return;

      const res = await axiosInstance.get("/friends/all");
      const usersWithMetadata = res.data.map(u => ({
        ...u,
        lastMessagedAt: u.lastMessagedAt,
        lastMessageText: u.lastMessageText,
      }));
      set({ users: usersWithMetadata });
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load users");
    } finally {
      set({ isUsersLoading: false });
    }
  },

  getMessages: async (userId) => {
    if (!userId) return;
    set({ isMessagesLoading: true });
    try {
      const res = await axiosInstance.get(`/messages/${userId}`);
      set({ messages: res.data });

      if (res.data.length) {
        const lastMsg = res.data[res.data.length - 1];
        set((state) => ({
          lastMessageData: {
            ...state.lastMessageData,
            [userId]: {
              text: lastMsg.text || lastMsg.image ? "📷 Image" : "",
              createdAt: lastMsg.createdAt,
            },
          },
          users: state.users.map(u =>
            u._id === userId
              ? {
                  ...u,
                  lastMessagedAt: lastMsg.createdAt,
                  lastMessageText: lastMsg.text || lastMsg.image ? "📷 Image" : "",
                }
              : u
          ),
        }));
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load messages");
    } finally {
      set({ isMessagesLoading: false });
    }
  },

  sendMessage: async (messageData) => {
    const { selectedUser, messages, users } = get();
    if (!selectedUser) return;

    const authUser = useAuthStore.getState().authUser;
    const tempMessage = {
      _id: Date.now(),
      senderId: authUser._id,
      receiverId: selectedUser._id,
      text: messageData.text || "",
      image: messageData.image || null,
      createdAt: new Date().toISOString(),
    };

    set({ messages: [...messages, tempMessage] });

    try {
      const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);

      set((state) => ({
        messages: state.messages.map((msg) =>
          msg._id === tempMessage._id ? res.data : msg
        ),
        users: state.users.map(u =>
          u._id === selectedUser._id
            ? {
                ...u,
                lastMessagedAt: res.data.createdAt,
                lastMessageText: res.data.text || res.data.image ? "📷 Image" : "",
              }
            : u
        ),
        lastMessageData: {
          ...state.lastMessageData,
          [selectedUser._id]: {
            text: res.data.text || res.data.image ? "📷 Image" : "",
            createdAt: res.data.createdAt,
          },
        },
      }));

      const socket = useAuthStore.getState().socket;
      socket?.emit("sendMessage", res.data);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send message");
      set((state) => ({
        messages: state.messages.filter((msg) => msg._id !== tempMessage._id),
      }));
    }
  },

  setSelectedUser: (user) => {
    set({ selectedUser: user });
    if (user) get().getMessages(user._id);
  },

  setSearchQuery: (query) => set({ searchQuery: query }),

  getFilteredUsers: () => {
    const { users, searchQuery, unreadMessages, lastMessageData } = get();
    const onlineUsers = useAuthStore.getState().onlineUsers;

    return users
      .filter(user => user.fullName.toLowerCase().includes(searchQuery.toLowerCase()))
      .map(user => ({
        ...user,
        isOnline: onlineUsers.includes(user._id),
        unread: unreadMessages[user._id] || 0,
        lastMessageText: lastMessageData[user._id]?.text || user.lastMessageText || "",
        lastMessagedAt: lastMessageData[user._id]?.createdAt || user.lastMessagedAt,
      }))
      .sort((a, b) => {
        if (a.lastMessagedAt && b.lastMessagedAt) return new Date(b.lastMessagedAt) - new Date(a.lastMessagedAt);
        else if (a.lastMessagedAt) return -1;
        else if (b.lastMessagedAt) return 1;
        else return a.fullName.localeCompare(b.fullName);
      });
  },

  subscribeToMessages: () => {
    const socket = useAuthStore.getState().socket;
    if (!socket) return;

    socket.on("receiveMessage", (message) => {
      const { selectedUser, messages, users, unreadMessages } = get();

      if (selectedUser && selectedUser._id === message.senderId) {
        set({ messages: [...messages, message] });
      }

      if (!selectedUser || selectedUser._id !== message.senderId) {
        set({
          unreadMessages: {
            ...unreadMessages,
            [message.senderId]: (unreadMessages[message.senderId] || 0) + 1,
          },
        });
      }

      set({
        users: users.map(u =>
          u._id === message.senderId
            ? {
                ...u,
                lastMessagedAt: message.createdAt,
                lastMessageText: message.text || message.image ? "" : "",
              }
            : u
        ),
        lastMessageData: {
          ...get().lastMessageData,
          [message.senderId]: {
            text: message.text || message.image ? "" : "",
            createdAt: message.createdAt,
          },
        },
      });
    });
  },

  unsubscribeFromMessages: () => {
    const socket = useAuthStore.getState().socket;
    socket?.off("receiveMessage");
  },

  clearChat: async () => {
    const { selectedUser, lastMessageData } = get();
    if (!selectedUser) return;

    try {
      await axiosInstance.delete(`/messages/clear/${selectedUser._id}`);
      set({
        messages: [],
        lastMessageData: { ...lastMessageData, [selectedUser._id]: { text: "", createdAt: null } },
      });
      toast.success("Chat cleared!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to clear chat");
    }
  },


}));
