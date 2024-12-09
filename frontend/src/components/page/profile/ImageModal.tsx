/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";
import { useUpdateProfileImage } from "./hooks/useUpdateProfileImage";
import { useUpdateCoverImage } from "./hooks/useUpdateCoverImage";
import toast from "react-hot-toast";

interface ImageModalProps {
  type: "profileimg" | "coverimg";
  closeModal: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ type, closeModal }) => {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);

  const {
    mutate: updateProfileImage,
    isLoading: isUploadingProfile,
  } = useUpdateProfileImage();

  const {
    mutate: updateCoverImage,
    isLoading: isUploadingCover,
  } = useUpdateCoverImage();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files ? event.target.files[0] : null;

    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please upload a valid image file.");
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
      setSelectedImage(file);
    }
  };

  const handleSubmit = () => {
    if (!selectedImage) {
      toast.error("Please select an image before uploading.");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Image = reader.result as string;

      const onSuccess = () => {
        toast.success(
          `${type === "profileimg" ? "Profile" : "Cover"} image updated successfully.`
        );
        closeModal();
      };

      const onError = (error: any) => {
        toast.error(error?.message || "Failed to update the image.");
      };

      if (type === "profileimg") {
        updateProfileImage({ profileimg: base64Image }, { onSuccess, onError });
      } else {
        updateCoverImage({ coverimg: base64Image }, { onSuccess, onError });
      }
    };

    reader.readAsDataURL(selectedImage);
  };

  const isUploading = isUploadingProfile || isUploadingCover;

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-40 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
        <h2 className="text-xl font-bold mb-4 text-center">
          {type === "profileimg" ? "Update Profile Picture" : "Update Cover Photo"}
        </h2>

        {/* File Input */}
        <div className="mb-4">
          <label htmlFor="image-upload" className="block text-sm font-medium mb-2">
            Select a new image
          </label>
          <input
            id="image-upload"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:bg-blue-100 file:text-blue-600 hover:file:bg-blue-200"
          />
        </div>

        {/* Image Preview */}
        {imagePreview && (
          <div className="mb-4">
            <h3 className="text-sm font-medium mb-2 text-center">Image Preview</h3>
            <img
              src={imagePreview}
              alt="Preview"
              className="w-full h-48 object-cover rounded-md shadow-sm"
            />
          </div>
        )}

        {/* Buttons */}
        <div className="flex justify-between items-center">
          <button
            className="text-red-500 hover:text-red-700 text-sm font-semibold"
            onClick={() => {
              setImagePreview(null);
              setSelectedImage(null);
            }}
          >
            Remove Image
          </button>

          <div className="flex space-x-4">
            <button
              onClick={closeModal}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md font-semibold hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isUploading || !selectedImage}
              className={`px-4 py-2 rounded-md font-semibold ${
                isUploading || !selectedImage
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
