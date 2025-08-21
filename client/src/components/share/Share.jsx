import React, { useEffect, useState } from "react";
import { IoCopyOutline, IoClose } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { enableBlur, disableBlur } from "../../hooks/blurSlice";
import ReactDOM from "react-dom";

const Share = ({ onClose }) => {
  const dispatch = useDispatch();
  const currentUrl = window.location.href; // 👈 Get current video link
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Lock scroll + enable blur
    document.body.style.overflow = "hidden";
    dispatch(enableBlur());

    return () => {
      document.body.style.overflow = "unset";
      dispatch(disableBlur());
    };
  }, [dispatch]);

  // Copy link to clipboard
  const handleCopy = () => {
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000); // Reset after 2 sec
    });
  };

  return ReactDOM.createPortal(
    <section
      onClick={onClose}
      className="share-overlay fixed inset-0 z-[999] cursor-pointer flex items-center justify-center bg-black/50"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white p-6 rounded-lg shadow-lg w-96"
      >
        <div className="flex justify-between mb-4 items-center">
          <h1 className="text-2xl font-bold text-black">Share</h1>
          <button className="text-2xl cursor-pointer " onClick={onClose}>
            <IoClose />
          </button>
        </div>

        <div className="border-2 border-black text-black w-full p-2 flex items-center justify-between rounded">
          <input
            type="text"
            value={currentUrl} // 👈 Auto-fill link
            readOnly
            className="p-2 w-64 outline-none"
          />
          <IoCopyOutline
            className={`w-8 h-8 cursor-pointer transition-colors ${
              copied ? "text-green-500" : "text-black"
            }`}
            onClick={handleCopy} // 👈 Copy to clipboard
          />
        </div>

        {copied && (
          <p className="text-green-600 text-sm mt-2">✅ Link copied!</p>
        )}
      </div>
    </section>,
    document.body
  );
};

export default Share;



