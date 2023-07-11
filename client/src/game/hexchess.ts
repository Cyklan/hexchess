import { Application } from "pixi.js";
import { Board } from "./board/Board";

const SCREEN_HEIGHT = window.innerHeight;
const PADDING = 50;

export class HexChess {
  private static instance: HexChess;

  private constructor(container: HTMLDivElement, interactive = true) {
    const size = SCREEN_HEIGHT - PADDING * 2;
    const app = new Application({
      width: size,
      height: size,
      backgroundColor: 0x242424,
      resolution: 1,
    });
    container.appendChild(app.view as HTMLCanvasElement);
    new Board(app, interactive);
  }

  public static createInstance(
    container: HTMLDivElement,
    interactive = true
  ): HexChess {
    return this.getInstance(container, interactive);
  }

  public static getInstance(container: HTMLDivElement | undefined, interactive = true): HexChess {
    if (!container) {
      throw new Error("Container is not defined");
    }

    if (!HexChess.instance) {
      HexChess.instance = new HexChess(container, interactive);
    }
    return HexChess.instance;
  }
}
