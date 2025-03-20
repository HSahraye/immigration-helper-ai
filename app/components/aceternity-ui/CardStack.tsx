"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

let interval: any;

type Card = {
  quote: string;
  name: string;
  title: string;
  image: string;
};

export const CardStack = ({
  items,
  offset = 10,
  scaleFactor = 0.06,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset;
  const SCALE_FACTOR = scaleFactor;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 5000);
  };

  return (
    <div className="relative h-[450px] w-full max-w-xl mx-auto">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.name}
            className="absolute bg-[#303134] h-full w-full rounded-xl p-8 border border-gray-700 shadow-xl"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
              opacity: Math.max(1 - index * 0.2, 0.5),
            }}
          >
            <div className="flex items-center mb-4">
              <img
                src={card.image}
                alt={card.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <div className="font-semibold text-gray-200">{card.name}</div>
                <div className="text-sm text-gray-400">{card.title}</div>
              </div>
            </div>
            <blockquote className="text-gray-400">
              {card.quote}
            </blockquote>
          </motion.div>
        );
      })}
    </div>
  );
}; 