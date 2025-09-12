import toast from "react-hot-toast";

interface ShareButtonProps {
  message: string;
}

export const ShareButton = ({ message }: ShareButtonProps) => {
  const share = () => {
    if (navigator.share) {
      navigator.share({ text: message }).catch(console.error);
    } else {
      toast.success("Copy your achievement: " + message);
    }
  };

  return (
    <button
      onClick={share}
      className="bg-blue-500 text-white px-4 py-2 rounded-md"
    >
      Share Achievement
    </button>
  );
};
