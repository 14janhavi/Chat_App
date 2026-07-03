import { useRef, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { Image, Send, X, Smile } from "lucide-react";
import EmojiPicker from "emoji-picker-react";
import toast from "react-hot-toast";

const MessageInput = () => {
  const [text, setText] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);

  const fileInputRef = useRef(null);

  const { sendMessage } = useChatStore();

  // ================= IMAGE =================
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please select an image.");
      return;
    }

    const reader = new FileReader();

    reader.onloadend = () => {
      setImagePreview(reader.result);
    };

    reader.readAsDataURL(file);
  };

  const removeImage = () => {
    setImagePreview(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // ================= EMOJI =================
  const onEmojiClick = (emojiData) => {
    setText((prev) => prev + emojiData.emoji);
  };

  // ================= SEND =================
  const handleSendMessage = async (e) => {
    e.preventDefault();

    if (!text.trim() && !imagePreview) return;

    try {
      await sendMessage({
        text: text.trim(),
        image: imagePreview,
      });

      setText("");
      setImagePreview(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      setShowEmojiPicker(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="p-4 w-full">

      {/* IMAGE PREVIEW */}

      {imagePreview && (
        <div className="mb-3">

          <div className="relative w-fit">

            <img
              src={imagePreview}
              alt="Preview"
              className="w-24 h-24 rounded-lg object-cover border"
            />

            <button
              type="button"
              onClick={removeImage}
              className="absolute -top-2 -right-2 bg-red-500 rounded-full p-1 text-white"
            >
              <X size={14} />
            </button>

          </div>

        </div>
      )}

      <form
        onSubmit={handleSendMessage}
        className="flex items-center gap-2"
      >

        {/* EMOJI */}

        <div className="relative">

          <button
            type="button"
            className="btn btn-circle btn-sm"
            onClick={() =>
              setShowEmojiPicker(!showEmojiPicker)
            }
          >
            <Smile size={20} />
          </button>

          {showEmojiPicker && (
            <div className="absolute bottom-12 left-0 z-50">
              <EmojiPicker
                onEmojiClick={onEmojiClick}
                theme="dark"
              />
            </div>
          )}

        </div>

        {/* MESSAGE */}

        <input
          type="text"
          placeholder="Type a message..."
          className="input input-bordered flex-1 rounded-lg"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* IMAGE */}

        <input
          type="file"
          accept="image/*"
          hidden
          ref={fileInputRef}
          onChange={handleImageChange}
        />

        <button
          type="button"
          className={`btn btn-circle ${
            imagePreview ? "text-green-500" : ""
          }`}
          onClick={() => fileInputRef.current?.click()}
        >
          <Image size={20} />
        </button>

        {/* SEND */}

        <button
          type="submit"
          className="btn btn-circle btn-primary"
          disabled={!text.trim() && !imagePreview}
        >
          <Send size={20} />
        </button>

      </form>
    </div>
  );
};

export default MessageInput;