import { describe, expect, it } from "vitest";
import { contrastRatio, parseHex, wcagResults } from "./contrast";

describe("contrast", () => {
  it("black on white is 21:1", () => {
    expect(contrastRatio(parseHex("#000")!, parseHex("#ffffff")!)).toBeCloseTo(21, 5);
  });
  it("same color is 1:1", () => {
    expect(contrastRatio(parseHex("#5956E9")!, parseHex("#5956e9")!)).toBeCloseTo(1, 5);
  });
  it("#767676 on white passes AA normal (4.54:1)", () => {
    const r = contrastRatio(parseHex("#767676")!, parseHex("#fff")!);
    expect(r).toBeCloseTo(4.54, 2);
    expect(wcagResults(r).aaNormal).toBe(true);
    expect(wcagResults(r).aaaNormal).toBe(false);
  });
  it("3:1 passes AA large but fails AA normal", () => {
    expect(wcagResults(3)).toEqual({ aaNormal: false, aaLarge: true, aaaNormal: false, aaaLarge: false });
  });
  it("rejects invalid hex", () => {
    expect(parseHex("#12")).toBeNull();
    expect(parseHex("zzzzzz")).toBeNull();
  });
});
