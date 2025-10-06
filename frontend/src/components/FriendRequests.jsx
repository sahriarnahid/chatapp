import { useState } from "react";
import { ChevronRight, ChevronDown, Check, X } from "lucide-react";

const FriendRequests = ({ requests = [], accept, reject }) => {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div className="mt-2 px-2">
      {/* Header */}
      <div
        className="flex items-center justify-between cursor-pointer select-none p-2 hover:bg-base-200 rounded-md"
        onClick={() => setIsOpen(!isOpen)}
      >
        <span className="font-medium text-sm text-zinc-500">Friend Requests</span>
        {isOpen ? <ChevronDown className="size-4" /> : <ChevronRight className="size-4" />}
      </div>

      {/* Requests List */}
      {isOpen && (
        <div className="mt-1">
          {requests.length > 0 ? (
            requests.map((user) => (
              <div
                key={user._id}
                className="flex items-center justify-between p-2 mb-1 bg-base-200 rounded-full"
              >
                <div className="flex items-center gap-2">
                  <img
                    src={user.profilePic || "/avatar.png"}
                    alt={user.fullName}
                    className="size-10 object-cover rounded-full"
                  />
                  <span className="text-sm truncate">{user.fullName}</span>
                </div>
                <div className="flex gap-1">
                  <button
                    onClick={() => accept(user._id)}
                    className="btn btn-xs btn-success p-1 rounded-full"
                  >
                    <Check className="size-3" />
                  </button>
                  <button
                    onClick={() => reject(user._id)}
                    className="btn btn-xs btn-error p-1 rounded-full"
                  >
                    <X className="size-3" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="text-xs text-zinc-400 py-2">No friend requests</div>
          )}
        </div>
      )}
    </div>
  );
};

export default FriendRequests;
