import { create } from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from 'socket.io-client';

const BASE_URL =
  import.meta.env.MODE === 'development'
    ? 'http://localhost:5001'
    : window.location.origin; // Use same origin - proxied through Vercel

export const useAuthStore = create((set, get) => ({
  authUser: null,
  isSigningUp: false,
  isLoggingIn: false,
  isUpdatingProfile: false,
  isCheckingAuth: true,
  onlineUsers: [],
  socket: null,

  checkAuth: async () => {
    try {
      const res = await axiosInstance.get('/auth/check');
      set({ authUser: res.data });
      get().connectSocket();
    } catch (error) {
      console.log('Error in checkAuth:', error);
      set({ authUser: null });
    } finally {
      set({ isCheckingAuth: false });
    }
  },

  signup: async data => {
    set({ isSigningUp: true });
    try {
      const res = await axiosInstance.post('/auth/signup', data);
      set({ authUser: res.data });
      toast.success('Account created successfully');
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Sign up failed');
    } finally {
      set({ isSigningUp: false });
    }
  },

  login: async data => {
    set({ isLoggingIn: true });
    try {
      const res = await axiosInstance.post('/auth/login', data);
      set({ authUser: res.data });
      toast.success('Logged in successfully');
      get().connectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
    } finally {
      set({ isLoggingIn: false });
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post('/auth/logout');
      set({ authUser: null });
      toast.success('Logged out successfully');
      get().disconnectSocket();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Logout failed');
    }
  },

  updateProfile: async data => {
    set({ isUpdatingProfile: true });
    try {
      const res = await axiosInstance.put('/auth/update-profile', data);
      set({ authUser: res.data });
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    } finally {
      set({ isUpdatingProfile: false });
    }
  },

  connectSocket: () => {
    const { authUser } = get();
    if (!authUser || get().socket?.connected) return;

    const socket = io(BASE_URL, {
      query: { userId: authUser._id },
    });
    socket.connect();
    set({ socket });

    socket.on('getOnlineUsers', userIds => set({ onlineUsers: userIds }));

    socket.on('receive_friend_request', friend => {
      const authUser = get().authUser;
      if (!authUser.friendRequests?.find(f => f._id === friend._id)) {
        set({
          authUser: {
            ...authUser,
            friendRequests: [...(authUser.friendRequests || []), friend],
          },
        });
      }
      toast.success(`${friend.fullName} sent you a friend request`);
    });

    socket.on('friend_request_accepted', friend => {
      const authUser = get().authUser;
      if (!authUser.friends?.find(f => f._id === friend._id)) {
        set({
          authUser: {
            ...authUser,
            friends: [...(authUser.friends || []), friend],
            friendRequests: authUser.friendRequests?.filter(
              f => f._id !== friend._id
            ),
          },
        });
        toast.success(`${friend.fullName} accepted your friend request`);
      }
    });
  },

  disconnectSocket: () => {
    if (get().socket?.connected) get().socket.disconnect();
  },

  sendFriendRequest: async friendId => {
    try {
      await axiosInstance.post(`/friends/request/${friendId}`);
      toast.success('Friend request sent');
      // emit socket event
      const socket = get().socket;
      const friend = get().authUser; // optional: you can send friend info
      socket?.emit('send_friend_request', { _id: friendId });
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to send friend request'
      );
    }
  },

  acceptFriendRequest: async friendId => {
    try {
      const res = await axiosInstance.post(`/friends/accept/${friendId}`);
      const friend = res.data;
      const authUser = get().authUser;
      set({
        authUser: {
          ...authUser,
          friends: [...(authUser.friends || []), friend],
          friendRequests: authUser.friendRequests?.filter(
            f => f._id !== friendId
          ),
        },
      });
      toast.success('Friend request accepted');
      get().socket?.emit('accept_friend_request', friend);
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to accept friend request'
      );
    }
  },

  rejectFriendRequest: async friendId => {
    try {
      const authUser = get().authUser;
      set({
        authUser: {
          ...authUser,
          friendRequests: authUser.friendRequests?.filter(
            f => f._id !== friendId
          ),
        },
      });
      await axiosInstance.post(`/friends/reject/${friendId}`);
      toast.success('Friend request rejected');
    } catch (error) {
      toast.error(
        error.response?.data?.message || 'Failed to reject friend request'
      );
    }
  },
}));
