import { Application, Graphics, Point, Sprite } from "pixi.js";
import { BoardColor, getColor } from "./BoardColor";
import { Coordinate } from "./Coordinate";
import { Piece } from "./Piece";
import { BlackHexagon, GrayHexagon, WhiteHexagon } from "../../assets/hexagons";
import { Layout } from "./Layout";

export const HEX_SIZE = 40;
export const HEX_WIDTH = HEX_SIZE * 2;
export const HEX_HEIGHT = HEX_WIDTH * 0.8660254;

export class Field {
  public piece: Piece | null = null;
  public color: BoardColor;
  public coordinate: Coordinate;
  public sprite: Sprite;
  private offset: Point;
  private hex_size: number;

  private get hex_width() {
    return this.hex_size * 2;
  }

  private get hex_height() {
    return this.hex_width * 0.8660254;
  }

  private app: Application;

  /**
   *
   */
  constructor(coordinate: Coordinate, app: Application) {
    this.coordinate = coordinate;
    this.color = this.getColorByCoordinate(coordinate);
    this.app = app;
    this.offset = new Point(app.view.width / 2, app.view.height / 2);

    this.hex_size = (app.view.width - 50) / (9 * 2 + 1);

    this.sprite = this.getHexagonSprite();
    this.drawHexagon();
  }

  private getColorByCoordinate(_coordinate: Coordinate) {
    return BoardColor.Gray;
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

    const layout = new Layout(
      Layout.flat,
      new Point(this.hex_size, this.hex_size),
      this.offset
    );

    const corners = layout.polygonCorners(this.coordinate);
    const coordinates = corners.map((corner) => [corner.x, corner.y]).flat(1);

    hex.beginFill(0xffffff);
    hex.lineStyle(2, 0x000000, 1);
    hex.drawPolygon(coordinates);
    hex.endFill();

    this.app.stage.addChild(hex);

    return hex;
  }

  private getHexColor = () => {
    return getColor(this.color);
  }
}
