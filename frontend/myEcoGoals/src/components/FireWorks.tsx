import { useEffect } from "react";

export default function Fireworks() {
  useEffect(() => {
    const handler = async () => {
      const confetti = (await import("canvas-confetti")).default;
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
      });
    };

    window.addEventListener("fireworks", handler);
    return () => window.removeEventListener("fireworks", handler);
  }, []);

  return null;
}
