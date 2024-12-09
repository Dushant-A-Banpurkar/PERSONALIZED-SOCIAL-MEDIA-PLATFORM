import { X } from "lucide-react";
import { CiImageOn } from "react-icons/ci";
import { BsEmojiSmileFill } from "react-icons/bs";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useQuery } from "@tanstack/react-query";
import { useCreatePost } from "../../../hooks/homepage_hooks/useCreatePost";
import EmojiPicker from "emoji-picker-react";

interface CreatePostProps {
  onClose: () => void;
}

const CreatePost: React.FC<CreatePostProps> = ({ onClose }) => {
  const [text, setText] = useState<string>("");
  const [img, setImg] = useState<string | null>(null);
  const imgRef = useRef<HTMLInputElement | null>(null);
  const [showEmoji, setShowEmoji] = useState(false);

  const { data: authUser } = useQuery({ queryKey: ["authUser"] });

  const { mutate: createPost, isPending, isError, error } = useCreatePost();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    createPost({ text, img });
    setText("");
    setImg(null);
    onClose();
  };

  const handleImgChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => setImg(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-md md:max-w-lg overflow-hidden relative">
        {/* Close button */}
        <button className="absolute top-2 right-2" onClick={onClose}>
          <X size={30} />
        </button>

        {/* Header */}
        <div className="border-b px-4 py-2 flex justify-between items-center">
          <h3 className="text-lg font-semibold">Create new post</h3>
        </div>

        {/* Form */}
        <form className="p-4 flex flex-col gap-4" onSubmit={handleSubmit}>
          {/* Textarea for post content */}
          <textarea
            className="w-full p-2 h-32 text-lg resize-none border border-gray-300 rounded-md focus:outline-none"
            placeholder="What's happening?"
            value={text}
            onChange={(e) => setText(e.target.value)}
          />

          {/* Image preview */}
          {img && (
            <div className="relative">
              <IoCloseSharp
                className="absolute top-2 right-2 text-white bg-black bg-opacity-75 rounded-full w-6 h-6 cursor-pointer"
                onClick={() => {
                  setImg(null);
                  if (imgRef.current) imgRef.current.value = null;
                }}
              />
              <img src={img} className="w-full h-48 object-cover rounded-md" />
            </div>
          )}

          {/* Buttons (Image upload, Emoji picker) */}
          <div className="flex justify-between items-center">
            <div className="flex gap-4">
              {/* Image icon */}
              <CiImageOn
                className="w-6 h-6 cursor-pointer"
                onClick={() => imgRef.current?.click()}
              />
              {/* Emoji picker */}
              <BsEmojiSmileFill
                onClick={() => setShowEmoji(!showEmoji)}
                className="w-6 h-6 cursor-pointer text-yellow-400"
              />
              {showEmoji && <EmojiPicker onEmojiClick={(e, emojiObject) => setText(text + emojiObject.emoji)} />}
            </div>

            {/* Hidden image input */}
            <input
              type="file"
              accept="image/*"
              hidden
              ref={imgRef}
              onChange={handleImgChange}
            />

            {/* Submit button */}
            <button
              type="submit"
              className="px-4 py-2 rounded-md text-white bg-blue-600"
              disabled={isPending}
            >
              {isPending ? "Posting..." : "Post"}
            </button>
          </div>
          
          {/* Error handling */}
          {isError && <p className="text-red-500 text-sm">{error.message}</p>}
        </form>
      </div>
    </div>
  );
};

export default CreatePost;
