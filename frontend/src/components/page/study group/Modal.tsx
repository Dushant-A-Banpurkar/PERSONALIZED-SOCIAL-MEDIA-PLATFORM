import React, { useEffect } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  // Close the modal when the Escape key is pressed
  useEffect(() => {
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    // Add event listener on mount
    if (isOpen) {
      document.addEventListener("keydown", handleKeydown);
    }

    // Clean up the event listener on unmount or when isOpen changes
    return () => {
      document.removeEventListener("keydown", handleKeydown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-labelledby="modal-title"
      role="dialog"
      aria-hidden={!isOpen}
    >
      <div className="bg-white rounded-lg shadow-lg w-96 p-6 relative" role="document">
        <h2 id="modal-title" className="text-xl font-bold mb-4">
          {title}
        </h2>
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-black"
          onClick={onClose}
          aria-label="Close modal"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
