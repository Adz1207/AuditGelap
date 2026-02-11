"use client";

import { motion } from "framer-motion";

interface Props {
  text: string;
  speed?: number;
  className?: string;
}

const TypewriterEffect = ({ text, speed = 0.01, className = "" }: Props) => {
  const letters = Array.from(text);

  const container = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: speed, delayChildren: 0.04 * i },
    }),
  };

  const child = {
    visible: {
      opacity: 1,
      display: "inline",
      transition: {
        type: "spring",
        damping: 12,
        stiffness: 200,
      },
    },
    hidden: {
      opacity: 0,
      display: "none",
    },
  };

  return (
    <motion.div
      style={{ display: "inline" }}
      variants={container}
      initial="hidden"
      animate="visible"
      className={className}
    >
      {letters.map((letter, index) => (
        <motion.span variants={child} key={index}>
          {letter}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default TypewriterEffect;