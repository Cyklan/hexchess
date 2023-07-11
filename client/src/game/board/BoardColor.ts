export enum BoardColor {
  Black,
  White,
  Gray,
}

export function getColor(color: BoardColor) {
  switch (color) {
    case BoardColor.Black:
      return 0xd28c45;
    case BoardColor.White:
      return 0xffcd9a;
    case BoardColor.Gray:
      return 0xefac66;
  }
}
