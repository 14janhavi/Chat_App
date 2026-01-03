import { X } from "lucide-react";
import useAuthStore from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser } = useChatStore();
  const { onlineUsers = [] } = useAuthStore();

  if (!selectedUser) return null;

  const isOnline =
    Array.isArray(onlineUsers) && onlineUsers.includes(selectedUser._id);

  return (
    <div className="p-2.5 border-b border-base-300 flex justify-between">
      <div>
        <h3 className="font-medium">{selectedUser.fullName}</h3>
        <p className="text-sm">{isOnline ? "Online" : "Offline"}</p>
      </div>

      <button onClick={() => setSelectedUser(null)}>
        <X />
      </button>
    </div>
  );
};

export default ChatHeader;
