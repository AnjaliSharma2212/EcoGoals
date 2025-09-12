import { motion } from "framer-motion";
import { Leaf, Trophy, BarChart3 } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();
  const handleLogin = () => {
    navigate("/login");
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-sky-200 via-emerald-100 to-green-200 text-gray-900 overflow-hidden flex flex-col">
      {/* 🌞 Sun */}
      <div className="absolute m-8 top-6 right-6 flex items-center justify-center z-20">
        <motion.div
          className="relative text-8xl"
          animate={{ rotate: [0, 15, -15, 0] }}
          transition={{ repeat: Infinity, duration: 10 }}
        >
          🌞
          <motion.div
            className="absolute -inset-12 rounded-full bg-yellow-400 opacity-30 blur-3xl"
            animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
          />
        </motion.div>
      </div>

      {/* ☁️ Clouds */}
      {[
        { left: "50%", size: "8xl", duration: 30 },
        { left: "30%", size: "4xl", duration: 35 },
        { left: "75%", size: "8xl", duration: 40 },
      ].map((c, idx) => (
        <motion.div
          key={idx}
          className={`absolute top-${idx * 10 + 15} text-${c.size} z-10`}
          style={{ left: c.left }}
          animate={{ x: ["-200px", "200px", "-200px"] }}
          transition={{
            repeat: Infinity,
            duration: c.duration,
            ease: "easeInOut",
          }}
        >
          ☁️
        </motion.div>
      ))}

      {/* 🌤️ Birds (high in the sky) */}
      <motion.img
        src="/birds/flying-bird1.gif"
        alt="Flying Bird"
        className="absolute w-16 md:w-24 z-30"
        style={{ top: "25%", left: "-10%" }}
        animate={{ x: ["-15vw", "115vw"], y: [0, -20, 0, 20, 0] }}
        transition={{ repeat: Infinity, duration: 18, ease: "linear" }}
      />

      <motion.img
        src="/birds/flying-bird2.gif"
        alt="Flying Bird"
        className="absolute w-16 md:w-24 z-30"
        style={{ top: "25%", left: "-20%" }}
        animate={{ x: ["-15vw", "115vw"], y: [0, -25, 0, 25, 0] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          delay: 3,
          ease: "linear",
        }}
      />
      <motion.img
        src="/birds/parrot1.gif"
        alt="Flying Bird"
        className="absolute w-16 md:w-24 z-30"
        style={{ top: "15%", left: "-20%" }}
        animate={{ x: ["-15vw", "115vw"], y: [0, -25, 0, 25, 0] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          delay: 3,
          ease: "linear",
        }}
      />
      <motion.img
        src="/birds/parrot.gif"
        alt="Flying Bird"
        className="absolute w-16 md:w-24 z-30"
        style={{ top: "35%", left: "-15%" }}
        animate={{ x: ["-15vw", "115vw"], y: [0, -25, 0, 25, 0] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          delay: 3,
          ease: "linear",
        }}
      />
      <motion.img
        src="/birds/parrot1.gif"
        alt="Flying Bird"
        className="absolute w-16 md:w-24 z-30"
        style={{ top: "45%", left: "-15%" }}
        animate={{ x: ["-15vw", "115vw"], y: [0, -25, 0, 25, 0] }}
        transition={{
          repeat: Infinity,
          duration: 20,
          delay: 3,
          ease: "linear",
        }}
      />

      {/* 🦋 Butterflies (low, over trees only) */}
      <motion.img
        src="/birds/butterfly1.gif"
        alt="Butterfly"
        className="absolute w-16 md:w-20 z-40"
        style={{ bottom: "25%", left: "-20%" }} // relative to trees
        animate={{ x: ["-20vw", "120vw"], y: [0, -25, 0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      />

      <motion.img
        src="/birds/butterfly2.gif"
        alt="Butterfly"
        className="absolute w-16 md:w-20 z-40"
        style={{ bottom: "30%", left: "-20%" }}
        animate={{ x: ["-20vw", "120vw"], y: [0, -30, 0, 30, 0] }}
        transition={{
          repeat: Infinity,
          duration: 24,
          delay: 3,
          ease: "linear",
        }}
      />

      {/* 🦋 Butterflies (low, over trees only) */}
      <motion.img
        src="/birds/butterfly1.gif"
        alt="Butterfly"
        className="absolute w-16 md:w-20 z-40"
        style={{ bottom: "25%", left: "-20%" }} // relative to trees
        animate={{ x: ["-20vw", "120vw"], y: [0, -25, 0, 25, 0] }}
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      />

      <motion.img
        src="/birds/butterfly2.gif"
        alt="Butterfly"
        className="absolute w-16 md:w-20 z-40"
        style={{ bottom: "30%", left: "-20%" }}
        animate={{ x: ["-20vw", "120vw"], y: [0, -30, 0, 30, 0] }}
        transition={{
          repeat: Infinity,
          duration: 24,
          delay: 3,
          ease: "linear",
        }}
      />

      <motion.img
        src="/birds/butterfly3.gif"
        alt="Butterfly"
        className="absolute w-16 md:w-20 z-40"
        style={{ bottom: "25%", left: "-50%" }} // relative to trees
        transition={{ repeat: Infinity, duration: 22, ease: "linear" }}
      />

      <motion.img
        src="/birds/butterfly3.gif"
        alt="Butterfly"
        className="absolute w-16 md:w-30 z-50"
        style={{ bottom: "20%", left: "-40%" }}
        transition={{
          repeat: Infinity,
          duration: 24,
          delay: 3,
          ease: "linear",
        }}
      />
      <h1>Hii</h1>
      {/* 🌳 Trees with Sitting Birds */}
      <div className="absolute bottom-9 left-0 right-0 flex justify-around items-end z-30">
        {/* Tree 1 */}
        <div className="relative flex flex-col items-center">
          <img src="/trees/tree1.png" alt="Tree 1" className="w-40 md:w-56" />
          <motion.img
            src="/birds/bird1.png"
            alt="Sitting Bird"
            className="absolute w-8"
            style={{
              bottom: "75%",
              left: "50%",
              transform: "translateX(-50%)",
            }}
            animate={{ y: [0, -3, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </div>

        {/* Tree 2 */}
        <div className="relative flex flex-col items-center">
          <img src="/trees/tree1.png" alt="Tree 2" className="w-44 md:w-60" />
          <motion.img
            src="/birds/bird2.png"
            alt="Sitting Bird"
            className="absolute w-10"
            style={{ bottom: "78%", right: "25%" }}
            animate={{ y: [0, -4, 0], scale: [1, 1.1, 1] }}
            transition={{ repeat: Infinity, duration: 1.8 }}
          />
        </div>

        {/* Tree 3 */}
        <div className="relative flex flex-col items-center">
          <img src="/trees/tree1.png" alt="Tree 3" className="w-36 md:w-52" />
          <motion.img
            src="/birds/bird3.png"
            alt="Sitting Bird"
            className="absolute w-8"
            style={{ bottom: "80%", left: "40%" }}
            animate={{ y: [0, -2, 0], scale: [1, 1.15, 1] }}
            transition={{ repeat: Infinity, duration: 2 }}
          />
        </div>
      </div>

      {/* 🍃 Floating Leaves */}
      {Array.from({ length: 6 }).map((_, idx) => (
        <motion.div
          key={idx}
          className="absolute text-3xl z-20"
          style={{
            top: `${10 + idx * 12}%`,
            left: `${8 + idx * 15}%`,
          }}
          animate={{ y: [0, 20, 0], rotate: [0, 15, -15, 0] }}
          transition={{
            repeat: Infinity,
            duration: 6 + idx * 2,
            ease: "easeInOut",
          }}
        >
          🍃
        </motion.div>
      ))}

      {/* 🌟 Hero Section */}
      <section className="flex flex-col items-center justify-center text-center py-20 md:py-28 px-6 md:px-12 flex-1 relative z-40">
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-emerald-700 mb-6"
          initial={{ opacity: 0, y: -40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          EcoGoals 🌱
        </motion.h1>

        <motion.p
          className="text-lg sm:text-xl md:text-2xl max-w-2xl mb-8 text-gray-700"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          Build sustainable habits, track your progress, and make a real impact
          on the planet.
        </motion.p>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleLogin}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-2xl shadow-lg text-lg transition"
        >
          Start Your Green Journey
        </motion.button>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 px-6 md:px-20 py-16 relative z-40">
        {[
          {
            icon: <Leaf className="w-12 h-12 text-emerald-600 mb-4" />,
            title: "Track Eco-Habits",
            desc: "Log daily eco-actions like saving water, reducing plastic, and more.",
          },
          {
            icon: <BarChart3 className="w-12 h-12 text-emerald-600 mb-4" />,
            title: "Progress Dashboard",
            desc: "Visualize streaks & impact with charts and calendars.",
          },
          {
            icon: <Trophy className="w-12 h-12 text-emerald-600 mb-4" />,
            title: "Earn Badges",
            desc: "Celebrate milestones with badges & grow your EcoTree 🌳.",
          },
        ].map((feature, idx) => (
          <motion.div
            key={idx}
            className="bg-white rounded-2xl shadow-md p-8 hover:shadow-xl transition"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: idx * 0.2 }}
            whileHover={{ scale: 1.05 }}
          >
            {feature.icon}
            <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
            <p className="text-gray-600">{feature.desc}</p>
          </motion.div>
        ))}
      </section>

      {/* Community Call */}
      <motion.section
        className="text-center text-white py-20 px-6 relative z-40"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
      >
        {" "}
        <h2 className="text-3xl md:text-4xl font-bold mb-6 text-green-400">
          Join the EcoTribe 🤝
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto text-green-400">
          Thousands of changemakers are tracking habits and reducing their
          footprint. Be part of the movement!
        </p>
        <motion.button
          whileHover={{ scale: 1.1, rotate: 1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-white text-emerald-700 font-bold px-8 py-3 rounded-2xl text-lg shadow-lg hover:bg-gray-100 transition"
        >
          Get Started Free
        </motion.button>
      </motion.section>
      <motion.img
        src="/birds/birdsEat.gif"
        alt="Eating Bird"
        className="absolute w-20 md:w-28 z-30"
        style={{
          bottom: "8%", // close to ground
          left: "25%", // adjust horizontally to sit under a tree
        }}
        animate={{
          y: [0, -5, 0], // small pecking bounce
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />

      <motion.img
        src="/birds/birdsEat.gif"
        alt="Eating Bird"
        className="absolute w-20 md:w-28 z-30"
        style={{
          bottom: "3%", // close to ground
          left: "45%", // adjust horizontally to sit under a tree
        }}
        animate={{
          y: [0, -5, 0], // small pecking bounce
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />

      {/* Ground Strip */}
      <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-t from-green-700 via-green-600 to-transparent z-20" />
      <motion.img
        src="/birds/birdsEat.gif"
        alt="Eating Bird"
        className="absolute w-20 md:w-28 z-30"
        style={{
          bottom: "4%", // close to ground
          left: "25%", // adjust horizontally to sit under a tree
        }}
        animate={{
          y: [0, -5, 0], // small pecking bounce
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />
      <motion.img
        src="/birds/birdsEat.gif"
        alt="Eating Bird"
        className="absolute w-20 md:w-28 z-30"
        style={{
          bottom: "5%", // close to ground
          left: "35%", // adjust horizontally to sit under a tree
        }}
        animate={{
          y: [0, -5, 0], // small pecking bounce
          scale: [1, 1.05, 1],
        }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
      />
      {/* Footer */}
      <footer className="relative z-50 bg-emerald-800 text-white py-6 px-7 text-center rounded-t-lg shadow-inner mt-20 ">
        © {new Date().getFullYear()} EcoGoals. Made with 🌍 for a greener
        future.
      </footer>
    </div>
  );
}
