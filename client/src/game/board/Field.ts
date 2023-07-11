import { Application, DisplayObject, Graphics, Point, Text } from "pixi.js";
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
  private playerColor: PieceColor;

  private hexagon: Graphics;
  private highlightCircle: DisplayObject | null = null;

  private isHighlighted = false;
  public isStartTile = false;
  public canBeCaptured = false;
  public wasPartOfPreviouseMove = false;
  public isInteractive = true;

  private highlightFields: (
    patterns: PieceMovementPattern[],
    coordinate: Coordinate
  ) => void;

  private movePiece: (to: Coordinate) => void;

  // private get hex_width() {
  //   return this.hexSize * 2;
  // }

  // private get hex_height() {
  //   return this.hex_width * 0.8660254;
  // }

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
    isInteractive = true,
    highlightFields: (
      patterns: PieceMovementPattern[],
      coordinate: Coordinate
    ) => void,
    movePiece: (to: Coordinate) => void
  ) {
    this.coordinate = coordinate;
    this.app = app;
    this.offset = new Point(app.view.width / 2, app.view.height / 2);
    this.colIndex = colOffset;
    this.colPosition = colPosition;
    this.highlightFields = highlightFields;
    this.movePiece = movePiece;
    this.playerColor = myColor;
    this.isInteractive = isInteractive;

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

    if (this.isHighlighted && !this.canBeCaptured) {
      const circle = new Graphics();
      circle.beginFill(0x000000, 0.25);
      circle.drawEllipse(
        center.x,
        center.y,
        this.hexSize / 4,
        this.hexSize / 4
      );
      circle.endFill();
      this.highlightCircle = hex.addChild(circle);
    } else if (this.isHighlighted && this.canBeCaptured) {
      const circle = new Graphics();
      circle.lineStyle(5, 0, 0.3);
      circle.drawCircle(center.x, center.y, this.hexSize / 1.5);
      this.highlightCircle = hex.addChild(circle);
    }

    if (this._piece) {
      this._piece.sprite.anchor.set(0.5);
      this._piece.sprite.position = center;
      hex.addChild(this._piece.sprite);
    }
    text.anchor.set(0.5);
    text.position = center;

    this.hexagon = this.app.stage.addChild(hex);

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
    hex.interactive = this.isInteractive;
    if (this._piece) {
      hex.onclick = () => {
        if (this._piece?.color !== this.playerColor) {
          // do check if piece can be captured
          if (this.isHighlighted && this.canBeCaptured) {
            this.movePiece(this.coordinate);
            this.highlightFields([], this.coordinate);
          }
          return;
        }
        this.highlightFields(this._piece.getMovementPattern(), this.coordinate);
        this.highlightStartTile();
      };
    } else {
      hex.onclick = () => {
        if (this.isHighlighted) {
          this.movePiece(this.coordinate);
        }
        this.highlightFields([], this.coordinate);
      };
    }

    return hex;
  };

  public disable = () => {
    this.hexagon.interactive = false;
  };

  public enable = () => {
    this.hexagon.interactive = this.isInteractive;
  };

  public highlightStartTile = () => {
    this.hexagon.tint = 0x90ee90;
    this.isStartTile = true;
  };

  public highlight = () => {
    this.isHighlighted = true;
    this.drawHexagon();
  };

  public unhighlight = () => {
    this.hexagon.tint = 0xffffff;
    this.isHighlighted = false;
    this.canBeCaptured = false;
    this.isStartTile = false;
    if (this.highlightCircle) {
      this.hexagon.removeChild(this.highlightCircle);
      this.highlightCircle = null;
    }
  };

  public highlightAsPreviousMove = () => {
    this.hexagon.tint = 0x90ee90;
    this.wasPartOfPreviouseMove = true;
  };

  public unhighlightAsPreviousMove = () => {
    this.unhighlight();
    this.wasPartOfPreviouseMove = false;
  };
}
