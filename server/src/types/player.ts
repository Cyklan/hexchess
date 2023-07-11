export type Player = {
  id: string;
  name: string;
  color: "white" | "black";
  websocket: WebSocket;
};
