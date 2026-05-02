const VALUES: ReadonlyArray<readonly [number, string]> = [
  [1000, "M"],
  [900, "CM"],
  [500, "D"],
  [400, "CD"],
  [100, "C"],
  [90, "XC"],
  [50, "L"],
  [40, "XL"],
  [10, "X"],
  [9, "IX"],
  [5, "V"],
  [4, "IV"],
  [1, "I"],
];

export function toRoman(num: number): string {
  let result = "";
  let n = num;
  for (const [v, sym] of VALUES) {
    while (n >= v) {
      result += sym;
      n -= v;
    }
  }
  return result;
}
