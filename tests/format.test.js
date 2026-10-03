import { describe, expect, it } from "vitest";
import { formatDate, formatDateTime, formatDuration, formatScore, hasScore, initials, scoreBand, scoreLabel, scoreToPercent, scoreTone } from "../src/lib/format.js";

describe("scores (backend scale is 0-10)", () => {
  it("shows 7.5 as 7.5/10, not 8%", () => {
    expect(formatScore(7.5)).toBe("7.5/10");
  });
  it("shows whole numbers without decimals", () => {
    expect(formatScore(8)).toBe("8/10");
  });
  it("does not treat 1 as 100% (old 0..1 guess)", () => {
    expect(formatScore(1)).toBe("1/10");
    expect(scoreToPercent(1)).toBe(10);
  });
  it("shows N/A for missing scores", () => {
    expect(formatScore(null)).toBe("N/A");
    expect(formatScore(undefined)).toBe("N/A");
    expect(hasScore(0)).toBe(true);
    expect(hasScore(null)).toBe(false);
  });
  it("clamps progress bar percentages", () => {
    expect(scoreToPercent(12)).toBe(100);
    expect(scoreToPercent(-1)).toBe(0);
    expect(scoreToPercent(null)).toBe(0);
  });
  // Bands are semantic now, so these assert the band rather than a palette name.
  it("picks a score band", () => {
    expect(scoreBand(9)).toBe("success");
    expect(scoreBand(7.5)).toBe("success");
    expect(scoreBand(6)).toBe("warning");
    expect(scoreBand(5)).toBe("warning");
    expect(scoreBand(2)).toBe("danger");
    expect(scoreBand(null)).toBe("neutral");
  });
  it("maps each band to a token class and a word", () => {
    expect(scoreTone(9)).toBe("text-success");
    expect(scoreTone(6)).toBe("text-warning");
    expect(scoreTone(2)).toBe("text-danger");
    expect(scoreTone(null)).toBe("text-muted-foreground");
    expect(scoreLabel(9)).toBe("Strong");
    expect(scoreLabel(null)).toBe("Not scored");
  });
});

describe("formatDuration", () => {
  it("formats m:ss", () => {
    expect(formatDuration(0)).toBe("0:00");
    expect(formatDuration(65)).toBe("1:05");
    expect(formatDuration(600)).toBe("10:00");
  });
  it("tolerates bad input", () => {
    expect(formatDuration(undefined)).toBe("0:00");
    expect(formatDuration(-5)).toBe("0:00");
  });
});

describe("initials", () => {
  it("takes up to two letters", () => {
    expect(initials("Krishna Kumar Gehlot")).toBe("KK");
    expect(initials("  ")).toBe("U");
    expect(initials()).toBe("U");
  });
});

describe("dates", () => {
  it("formats dates and date-times (toLocaleDateString rejects timeStyle, so this guards a crash)", () => {
    expect(formatDate("2026-10-01T10:00:00Z")).toMatch(/2026/);
    expect(formatDateTime("2026-10-01T10:00:00Z")).toMatch(/2026/);
  });
  it("returns an empty string for missing or invalid dates", () => {
    expect(formatDate(null)).toBe("");
    expect(formatDate("not a date")).toBe("");
  });
});
