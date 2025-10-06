import { X, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { useState } from "react";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  if (!selectedUser) return null;

  const handleConfirmClear = () => {
    clearChat();
    setIsModalOpen(false);
  };

  return (
    <div className="p-2.5 border-b border-base-300 flex justify-between items-center">
      <div className="flex items-center gap-3">
        {/* Avatar */}
        <div className="avatar">
          <div className="size-10 rounded-full relative">
            <img src={selectedUser.profilePic || "/avatar.png"} alt={selectedUser.fullName} />
          </div>
        </div>

        {/* User info */}
        <div>
          <h3 className="font-medium">{selectedUser.fullName}</h3>
          <p className="text-sm text-base-content/70">
            {onlineUsers.includes(selectedUser._id) ? "Online" : "Offline"}
          </p>
        </div>
      </div>

      <div className="flex gap-2">
        {/* Clear Chat Button */}
        <button
          onClick={() => setIsModalOpen(true)}
          className="btn btn-sm btn-ghost text-red-500 hover:bg-red-100"
          title="Clear Chat"
        >
          <Trash2 className="size-4" />
        </button>

        {/* Close Chat Button */}
        <button onClick={() => setSelectedUser(null)}>
          <X />
        </button>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-black rounded-lg shadow-lg p-6 w-80">
            <h2 className="text-lg font-semibold mb-4">Clear Chat?</h2>
            <p className="mb-6">This chat will be deleted forever. Are you sure?</p>
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setIsModalOpen(false)}
                className="btn btn-sm btn-ghost"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmClear}
                className="btn btn-sm btn-error"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatHeader;
