import { describe, expect, it } from "vitest";
import { formatStopwatchTime } from "./formatStopwatchTime";

describe("formatStopwatchTime", () => {
  it("formats zero", () => {
    expect(formatStopwatchTime(0)).toBe("00:00:00");
  });

  it("pads minutes, seconds, and centiseconds", () => {
    expect(formatStopwatchTime(61050)).toBe("01:01:05");
  });

  it("handles centiseconds boundary (990ms)", () => {
    expect(formatStopwatchTime(990)).toBe("00:00:99");
  });

  it("floors fractional milliseconds for centiseconds", () => {
    expect(formatStopwatchTime(999)).toBe("00:00:99");
    expect(formatStopwatchTime(1000)).toBe("00:01:00");
  });

  it("handles durations over an hour", () => {
    expect(formatStopwatchTime(3661500)).toBe("61:01:50");
  });
});
