import { VideoIcon } from "lucide-react";

import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

const CallButton = () => {
  const navigate = useNavigate();

  const handleStartCall = () => {
    const callId = uuidv4(); // Generates a unique ID
    navigate(`/call/${callId}`);
  };

  return (
    <button className="btn btn-primary" onClick={handleStartCall}>
      Start Call
    </button>
  );
};

export default CallButton;
