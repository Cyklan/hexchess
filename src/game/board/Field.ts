import { Application, Graphics, Point, Sprite, Text } from "pixi.js";
import { BoardColor, getColor } from "./BoardColor";
import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import { BlackHexagon, GrayHexagon, WhiteHexagon } from "../../assets/hexagons";
import { Layout } from "./Layout";

export const HEX_SIZE = 40;
export const HEX_WIDTH = HEX_SIZE * 2;
export const HEX_HEIGHT = HEX_WIDTH * 0.8660254;

const COLOR_ORDER = [BoardColor.White, BoardColor.Gray, BoardColor.Black];

export class Field {
  public piece: Piece | null = null;
  public color: BoardColor;
  public coordinate: Coordinate;
  public sprite: Sprite;
  private offset: Point;
  private hexSize: number;
  private colIndex;
  private colPosition;

  private get hex_width() {
    return this.hexSize * 2;
  }

  private get hex_height() {
    return this.hex_width * 0.8660254;
  }

  private app: Application;

  constructor(
    coordinate: Coordinate,
    app: Application,
    colOffset: number,
    colPosition: number
  ) {
    this.coordinate = coordinate;
    this.app = app;
    this.offset = new Point(app.view.width / 2, app.view.height / 2);
    this.colIndex = colOffset;
    this.colPosition = colPosition;
    
    this.color = this.calculateFieldColor(coordinate);
    this.hexSize = (app.view.width - 50) / (9 * 2 + 1);

    this.sprite = this.getHexagonSprite();
    this.drawHexagon();
  }

  private calculateFieldColor(_coordinate: Coordinate) {
    const index = (this.colIndex + this.colPosition) % COLOR_ORDER.length;
    console.log(index)
    return COLOR_ORDER[index];
  }

  private getHexagonSprite() {
    switch (this.color) {
      case BoardColor.White:
        return WhiteHexagon;
      case BoardColor.Black:
        return BlackHexagon;
      case BoardColor.Gray:
        return GrayHexagon;
    }
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

    console.log(this.color)

    hex.beginFill(this.getHexColor());
    hex.lineStyle(2, 0x000000, 1);
    hex.drawPolygon(coordinates);
    hex.endFill();

    this.app.stage.addChild(hex);

    // center of hex
    const center = layout.hexToPixel(this.coordinate);
    text.anchor.set(0.5);
    text.position = center;
    this.app.stage.addChild(text);

    return hex;
  }

  private getHexColor = () => {
    return getColor(this.color);
  };
}
