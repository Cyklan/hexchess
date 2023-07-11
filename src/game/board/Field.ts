import { Application, Graphics, Point, Text } from "pixi.js";
import { BoardColor, getColor } from "./BoardColor";
import { Coordinate } from "./Coordinate";
import { Layout } from "./Layout";
import { Piece, PieceType } from "../pieces/Piece";

export const HEX_SIZE = 40;
export const HEX_WIDTH = HEX_SIZE * 2;
export const HEX_HEIGHT = HEX_WIDTH * 0.8660254;

const COLOR_ORDER_WHITE = [BoardColor.White, BoardColor.Gray, BoardColor.Black];
const COLOR_ORDER_BLACK = [BoardColor.Black, BoardColor.Gray, BoardColor.White];

export class Field {
  private _piece: Piece | null = null;
  public color: BoardColor;
  public coordinate: Coordinate;
  private offset: Point;
  private hexSize: number;
  private colIndex;
  private colPosition;
  private app: Application;

  private get hex_width() {
    return this.hexSize * 2;
  }

  private get hex_height() {
    return this.hex_width * 0.8660254;
  }

  public get piece() {
    return this._piece;
  }

  public set piece(piece: Piece | null) {
    if (!piece && this._piece !== null) {
      this.app.stage.removeChild(this._piece.sprite);
    }
    console.log("placing piece", piece);
    this._piece = piece;
    this.drawHexagon();
  }

  constructor(
    coordinate: Coordinate,
    app: Application,
    colOffset: number,
    colPosition: number,
    myColor: "black" | "white" = "white"
  ) {
    this.coordinate = coordinate;
    this.app = app;
    this.offset = new Point(app.view.width / 2, app.view.height / 2);
    this.colIndex = colOffset;
    this.colPosition = colPosition;

    this.color = this.calculateFieldColor(myColor);
    this.hexSize = (app.view.width - 50) / (9 * 2 + 1);

    this.drawHexagon();
  }

  private calculateFieldColor(myColor: "black" | "white") {
    const colorOrder =
      myColor === "black" ? COLOR_ORDER_BLACK : COLOR_ORDER_WHITE;
    const index = (this.colIndex + this.colPosition) % colorOrder.length;
    if (this.coordinate.q <= 0) {
      return colorOrder[index];
    }
    return colorOrder[(index + this.coordinate.q) % 3];
  }

  private drawHexagon() {
    const hex = new Graphics();
    const coordinateAsString = `${this.coordinate.q},${this.coordinate.r}`;
    const text = new Text(coordinateAsString);

    const layout = new Layout(
      Layout.flat,
      new Point(this.hexSize, this.hexSize),
      this.offset
    );

    const corners = layout.polygonCorners(this.coordinate);
    const coordinates = corners.map((corner) => [corner.x, corner.y]).flat(1);

    hex.beginFill(this.getHexColor());
    hex.lineStyle(2, 0x000000, 1);
    hex.drawPolygon(coordinates);
    hex.endFill();

    // center of hex
    const center = layout.hexToPixel(this.coordinate);

    if (this._piece) {
      this._piece.sprite.anchor.set(0.5);
      this._piece.sprite.position = center;
      hex.addChild(this._piece.sprite);
    }

    // text.anchor.set(0.5);
    // text.position = center;

    // hex.addChild(text)

    this.app.stage.addChild(hex);

    return hex;
  }

  private getHexColor = () => {
    return getColor(this.color);
  };
}
