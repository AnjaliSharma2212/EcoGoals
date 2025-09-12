import { motion } from "framer-motion";
import { useState, useEffect } from "react";

function FlyingBird({
  frames,
  top,
  delay = 0,
  duration = 18,
  size = "w-20",
}: {
  frames: string[];
  top: string;
  delay?: number;
  duration?: number;
  size?: string;
}) {
  const [frame, setFrame] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setFrame((prev) => (prev + 1) % frames.length);
    }, 120); // 120ms per frame → ~8 fps
    return () => clearInterval(interval);
  }, [frames.length]);

  return (
    <motion.img
      src={frames[frame]}
      alt="Flying Bird"
      className={`absolute ${size} z-30`}
      style={{ top, left: "-15%" }}
      animate={{
        x: ["-15vw", "115vw"], // fly across screen
        y: [0, -30, 0, 30, 0], // glide
      }}
      transition={{
        repeat: Infinity,
        duration,
        delay,
        ease: "linear",
      }}
    />
  );
}

export default FlyingBird;
