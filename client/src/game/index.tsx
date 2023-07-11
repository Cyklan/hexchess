import { FC, useEffect, useRef, useState } from "react";
import { HexChess } from "./hexchess";

export const Game: FC<{ interactive: boolean }> = ({ interactive }) => {
  const [game, setGame] = useState<HexChess>();
  const gameContainer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!gameContainer.current) return;
    if (game) return;

    setGame(HexChess.createInstance(gameContainer.current, interactive));
  }, [gameContainer, game]);

  return <div ref={gameContainer}></div>;
};
