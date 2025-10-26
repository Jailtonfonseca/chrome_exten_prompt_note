import React, { useEffect, useState } from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        setIsMounted(true);
      }, 10);
      return () => clearTimeout(timer);
    } else {
      setIsMounted(false);
    }
  }, [isOpen]);

  if (!isOpen && !isMounted) { // Only return null if fully closed and unmounted for transition
    return null;
  }

  return (
    <div
      className={`
        fixed inset-0 flex items-center justify-center p-4 z-50
        bg-black transition-opacity duration-300 ease-in-out
        ${isOpen && isMounted ? 'bg-opacity-75 dark:bg-opacity-80 opacity-100' : 'bg-opacity-0 opacity-0'}
      `}
      onClick={onClose}
    >
      <div
        className={`
          bg-white dark:bg-gray-800 rounded-lg shadow-xl max-w-2xl w-full mx-auto
          transform transition-all duration-300 ease-in-out
          ${isOpen && isMounted ? 'scale-100 opacity-100' : 'scale-95 opacity-0'}
        `}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default Modal;