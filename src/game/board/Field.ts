import { Application, Graphics, Point, Text } from "pixi.js";
import { BoardColor, getColor } from "./BoardColor";
import { Coordinate } from "./Coordinate";
import { Layout } from "./Layout";
import { Piece } from "../pieces/Piece";
import { PieceMovementPattern } from "../pieces/PieceMovementPattern";
import { PieceColor } from "../pieces/PieceColor";

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
  private hexagon: Graphics;
  private playerColor: PieceColor;

  private isHighlighted = false;

  private highlightFields: (
    patterns: PieceMovementPattern[],
    coordinate: Coordinate
  ) => void;

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
    this._piece = piece;
    this.hexagon = this.drawHexagon();
  }

  constructor(
    coordinate: Coordinate,
    app: Application,
    colOffset: number,
    colPosition: number,
    myColor: "black" | "white" = "white",
    highlightFields: (
      patterns: PieceMovementPattern[],
      coordinate: Coordinate
    ) => void
  ) {
    this.coordinate = coordinate;
    this.app = app;
    this.offset = new Point(app.view.width / 2, app.view.height / 2);
    this.colIndex = colOffset;
    this.colPosition = colPosition;
    this.highlightFields = highlightFields;
    this.playerColor = myColor;

    this.color = this.calculateFieldColor(myColor);
    this.hexSize = (app.view.width - 50) / (9 * 2 + 1);

    this.hexagon = this.drawHexagon();
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
    // hex.addChild(text);

    if (this._piece) {
      this._piece.sprite.anchor.set(0.5);
      this._piece.sprite.position = center;
      hex.addChild(this._piece.sprite);
    }
    text.anchor.set(0.5);
    text.position = center;

    this.app.stage.addChild(hex);

    return this.registerEvents(hex);
  }

  private getHexColor = () => {
    return getColor(this.color);
  };

  private registerEvents = (hex: Graphics) => {
    hex = this.onClick(hex);

    return hex;
  };

  private onClick = (hex: Graphics) => {
    hex.interactive = true;
    if (this._piece) {
      hex.onclick = () => {
        if (this._piece?.color !== this.playerColor) {
          // only allow take moves
          return;
        }

        if (this.isHighlighted) {
          this.highlightFields([], this.coordinate);
        } else {
          this.highlightFields(
            this._piece.getMovementPattern(),
            this.coordinate
          );
          this.highlightStartTile();
        }
      };
    } else {
      hex.onclick = () => {
        this.highlightFields([], this.coordinate);
      };
    }

    return hex;
  };

  private highlightStartTile = () => {
    this.hexagon.tint = 0x00ff00;
    this.isHighlighted = true;
  };

  public highlight = () => {
    this.isHighlighted = true;
    this.drawHexagon();
  };

  public unhighlight = () => {
    this.hexagon.tint = 0xffffff;
    this.isHighlighted = false;
  };
}
