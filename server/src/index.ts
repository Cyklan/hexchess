import { WebSocket, WebSocketServer } from "ws";
import { Game } from "./types/game";
import { Player } from "./types/player";
import {
  JoinRandomMessage,
  JoinSpecificGameMessage,
  baseMessageSchema,
} from "./messages/baseMessageSchema";
import { Mutex } from "async-mutex";
import { createId } from "@paralleldrive/cuid2";

let randomPlayer: Player | null = null;
const randomPlayerMutex = new Mutex();
const games: Game[] = [];
const gamesMutex = new Mutex();

const wss = new WebSocketServer({
  port: 8080,
  perMessageDeflate: {
    zlibDeflateOptions: {
      // See zlib defaults.
      chunkSize: 1024,
      memLevel: 7,
      level: 3,
    },
    zlibInflateOptions: {
      chunkSize: 10 * 1024,
    },
    // Other options settable:
    clientNoContextTakeover: true, // Defaults to negotiated value.
    serverNoContextTakeover: true, // Defaults to negotiated value.
    serverMaxWindowBits: 10, // Defaults to negotiated value.
    // Below options specified as default values.
    concurrencyLimit: 10, // Limits zlib concurrency for perf.
    threshold: 1024, // Size (in bytes) below which messages
    // should not be compressed if context takeover is disabled.
  },
});

wss.on("connection", (ws) => {
  ws.on("message", (wsMessage) => {
    // parse message from json
    // check for message type
    // if message is join_random then set as randomPlayer
    // if randomPlayer is already set then move randomPlayer to game together with other player
    // if message is join_game then add user to game with random password that user generated
    // if game with random password already exists then add user to that game
    // if already two users in game with random password then send error
    // if message is game update perform game update

    try {
      const data = JSON.parse(wsMessage.toString());
      const message = baseMessageSchema.parse(data);

      // dependending on message type handle message
      switch (message.subject) {
        case "join_random":
          // @ts-ignore
          return handleJoinRandom(ws, message);
        case "join_game":
          // @ts-ignore
          return handleJoinSpecificGame(ws, message);
      }
    } catch {
      console.log("Invalid message");
    }
  });
});

function handleJoinRandom(ws: WebSocket, message: JoinRandomMessage) {
  randomPlayerMutex.runExclusive(() => {
    if (randomPlayer === null) {
      randomPlayer = {
        color: Math.random() > 0.5 ? "white" : "black",
        id: message.userId,
        name: message.userName,
        // @ts-ignore
        websocket: ws,
      };
      // TODO: send waiting for player message
      // ws.send()
    } else {
      const firstRandomPlayer = randomPlayer;
      const secondRandomPlayer: Player = {
        color: firstRandomPlayer.color === "white" ? "black" : "white",
        id: message.userId,
        name: message.userName,
        // @ts-ignore
        websocket: ws,
      };

      let game: Game = {
        id: createId(),
        password: "",
        history: [],
        players: [firstRandomPlayer, secondRandomPlayer],
      };

      gamesMutex.runExclusive(() => {
        games.push(game);
      });

      // TODO: send game start message
    }
  });
}

function handleJoinSpecificGame(
  ws: WebSocket,
  message: JoinSpecificGameMessage
) {
  gamesMutex.runExclusive(() => {
    const game = games.find((game) => game.password === message.password);
    if (!game) {
      const newGame: Game = {
        id: createId(),
        password: message.password,
        history: [],
        players: [
          {
            color: Math.random() > 0.5 ? "white" : "black",
            id: message.userId,
            name: message.userName,
            // @ts-ignore
            websocket: ws,
          },
        ],
      };

      games.push(newGame);
      return;
    }

    if (game.players.length === 2) {
      // send error message that game is full already
    }

    const player: Player = {
      color: game.players[0].color === "white" ? "black" : "white",
      id: message.userId,
      name: message.userName,
      // @ts-ignore
      websocket: ws,
    };

    game.players.push(player);
    // TODO: send game start message to both players
  });
}
