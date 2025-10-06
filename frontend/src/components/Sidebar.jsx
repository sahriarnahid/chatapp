import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import FriendRequests from "./FriendRequests";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, Search, Plus } from "lucide-react";

const Sidebar = () => {
  const {
    getUsers,
    users,
    selectedUser,
    setSelectedUser,
    isUsersLoading,
    setSearchQuery,
    getFilteredUsers,
  } = useChatStore();

  const {
    authUser,
    onlineUsers,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
  } = useAuthStore();

  const [showOnlineOnly, setShowOnlineOnly] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    getUsers();
  }, []);

  let filteredUsers = getFilteredUsers().filter((user) =>
    showOnlineOnly ? user.isOnline : true
  );

  if (isUsersLoading) return <SidebarSkeleton />;

  // Separate friends and other users
  const friends = filteredUsers.filter((user) =>
    authUser?.friends?.some((f) => f._id === user._id)
  );
  const others = filteredUsers.filter(
    (user) => !authUser?.friends?.some((f) => f._id === user._id)
  );

  const renderUserList = (list) =>
    list.map((user) => {
      const isFriend = authUser?.friends?.some((f) => f._id === user._id);
      const requested = authUser?.friendRequests?.some((f) => f._id === user._id);
      const unread = user.unread || 0;
      const isOnline = user.isOnline;

      return (
        <div
          key={user._id}
          className="flex items-center justify-between p-2 mb-1 hover:bg-base-200 rounded-full transition-colors"
        >
          <button
            className="flex items-center gap-2 w-full text-left relative"
            onClick={() => setSelectedUser(user)}
          >
            <img
              src={user.profilePic || "/avatar.png"}
              alt={user.fullName}
              className="size-12 object-cover rounded-full"
            />

            {isOnline && (
              <span className="absolute left-8 top-1 w-3 h-3 bg-green-500 rounded-full border border-white" />
            )}

            <div className="hidden lg:block flex-1 ml-2">
              <div className="font-medium truncate">{user.fullName}</div>
              <div className="text-sm text-zinc-400">{user.lastMessageText}</div>
              <div className="text-sm text-zinc-400">{isOnline ? "Online" : "Offline"}</div>
            </div>

            {unread > 0 && (
              <span className="ml-auto text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </button>

          {!isFriend && !requested && (
            <button
              onClick={() => sendFriendRequest(user._id)}
              className="btn btn-xs btn-primary p-1 rounded-full"
            >
              <Plus className="size-3" />
            </button>
          )}

          {requested && <span className="text-xs text-zinc-400">Requested</span>}
        </div>
      );
    });

  return (
    <aside className="h-full w-20 lg:w-80 border-r border-base-300 flex flex-col transition-all duration-200 p-2">
      {/* Header */}
      <div className="border-b border-base-300 w-full p-3">
        <div className="flex items-center gap-2">
          <Users className="size-6" />
          <span className="font-medium hidden lg:block">Contacts</span>
        </div>

        <div className="mt-2 hidden lg:flex items-center gap-2">
          <label className="cursor-pointer flex items-center gap-2">
            <input
              type="checkbox"
              checked={showOnlineOnly}
              onChange={(e) => setShowOnlineOnly(e.target.checked)}
              className="checkbox checkbox-sm"
            />
            <span className="text-sm">Show online only</span>
          </label>
          <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
        </div>

        <div className="mt-3 relative hidden lg:block">
          <Search className="absolute left-3 top-2.5 size-4 text-zinc-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setSearchQuery(e.target.value);
            }}
            className="input input-sm w-full pl-9"
          />
        </div>
      </div>

      {/* Friend Requests */}
      <FriendRequests
        requests={authUser?.friendRequests || []}
        accept={acceptFriendRequest}
        reject={rejectFriendRequest}
      />

      {/* Users List - SINGLE SCROLLABLE CONTAINER */}
      <div className="overflow-y-auto flex-1 w-full py-3">
        {/* Friends Section */}
        {friends.length > 0 && (
          <>
            <div className="text-xs font-semibold px-3 pt-2 pb-1 text-zinc-500">Friends</div>
            {renderUserList(friends)}
          </>
        )}

        {/* Other Users Section */}
        {others.length > 0 && (
          <>
            <div className="text-xs font-semibold px-3 pt-2 pb-1 text-zinc-500">Other Users</div>
            {renderUserList(others)}
          </>
        )}

        {filteredUsers.length === 0 && (
          <div className="text-center text-zinc-500 py-4">No users found</div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
