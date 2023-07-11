import { Point } from "pixi.js";
import { Orientation } from "./Orientation";
import { Coordinate } from "./Coordinate";

export class Layout {
  constructor(
    public orientation: Orientation,
    public size: Point,
    public origin: Point
  ) {}

  public static flat: Orientation = new Orientation(
    3.0 / 2.0,
    0.0,
    Math.sqrt(3.0) / 2.0,
    Math.sqrt(3.0),
    2.0 / 3.0,
    0.0,
    -1.0 / 3.0,
    Math.sqrt(3.0) / 3.0,
    0.0
  );

  public hexToPixel(h: Coordinate): Point {
    const M: Orientation = this.orientation;
    const size: Point = this.size;
    const origin: Point = this.origin;
    const x: number = (M.f0 * h.q + M.f1 * h.r) * size.x;
    const y: number = (M.f2 * h.q + M.f3 * h.r) * size.y;
    return new Point(x + origin.x, y + origin.y);
  }

  public pixelToHex(p: Point): Coordinate {
    const point = new Point(
      (p.x - this.origin.x) / this.size.x,
      (p.y - this.origin.y) / this.size.y
    );
    const q: number =
      this.orientation.b0 * point.x + this.orientation.b1 * point.y;
    const r: number =
      this.orientation.b2 * point.x + this.orientation.b3 * point.y;
    return { q, r };
  }

  public hexCornerOffset(corner: number): Point {
    const angle =
      (2.0 * Math.PI * (this.orientation.start_angle - corner)) / 6.0;
    return new Point(
      this.size.x * Math.cos(angle),
      this.size.y * Math.sin(angle)
    );
  }

  public polygonCorners(h: Coordinate) {
    const corners: Point[] = [];
    const center = this.hexToPixel(h);
    for (let i = 0; i < 6; i++) {
      const offset = this.hexCornerOffset(i);
      corners.push(new Point(center.x + offset.x, center.y + offset.y));
    }
    return corners;
  }
}
