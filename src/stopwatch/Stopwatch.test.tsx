import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { Stopwatch } from "./Stopwatch";

describe("Stopwatch", () => {
  it("renders primary controls", () => {
    render(<Stopwatch />);
    expect(screen.getByRole("button", { name: /^start$/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /^lap$/i })).toBeDisabled();
    expect(screen.getByRole("button", { name: /^reset$/i })).toBeInTheDocument();
  });

  it("calls onStart when starting", async () => {
    const user = userEvent.setup();
    const onStart = vi.fn();
    render(<Stopwatch onStart={onStart} />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));

    expect(onStart).toHaveBeenCalledTimes(1);
    expect(screen.getByRole("button", { name: /^stop$/i })).toBeInTheDocument();
  });

  it("calls onStop with elapsed time when stopping", async () => {
    const user = userEvent.setup();
    const onStop = vi.fn();
    render(<Stopwatch onStop={onStop} />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await waitFor(
      () => {
        const displays = screen.getAllByText(/^\d{2}:\d{2}:\d{2}$/);
        expect(displays.some((el) => el.textContent !== "00:00:00")).toBe(true);
      },
      { timeout: 3000 },
    );
    await user.click(screen.getByRole("button", { name: /^stop$/i }));

    expect(onStop).toHaveBeenCalledTimes(1);
    expect(typeof onStop.mock.calls[0][0]).toBe("number");
    expect(onStop.mock.calls[0][0]).toBeGreaterThan(0);
  });

  it("calls onReset when resetting", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();
    render(<Stopwatch onReset={onReset} />);

    await user.click(screen.getByRole("button", { name: /^reset$/i }));
    expect(onReset).toHaveBeenCalledTimes(1);
  });

  it("calls onLap with lap duration and total when lapping while running", async () => {
    const user = userEvent.setup();
    const onLap = vi.fn();
    render(<Stopwatch onLap={onLap} />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await waitFor(
      () => {
        expect(screen.getByRole("button", { name: /^lap$/i })).not.toBeDisabled();
      },
      { timeout: 3000 },
    );
    await user.click(screen.getByRole("button", { name: /^lap$/i }));

    expect(onLap).toHaveBeenCalledTimes(1);
    const [lapMs, totalMs] = onLap.mock.calls[0];
    expect(totalMs).toBeGreaterThanOrEqual(lapMs);
    expect(lapMs).toBeGreaterThanOrEqual(0);
  });

  it("applies manual time override", async () => {
    const user = userEvent.setup();
    render(<Stopwatch />);

    await user.click(screen.getByRole("button", { name: /^override$/i }));
    await user.type(screen.getByPlaceholderText("MM"), "1");
    await user.click(screen.getByRole("button", { name: /^apply$/i }));

    expect(screen.getAllByText("01:00:00").length).toBeGreaterThanOrEqual(1);
  });

  it("shows lap list after recording laps", async () => {
    const user = userEvent.setup();
    render(<Stopwatch />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /^lap$/i }));
    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /lap times/i })).toBeInTheDocument();
    });
    expect(screen.getByText(/^lap 1$/i)).toBeInTheDocument();
  });

  it("hides lap section when showLaps is false", async () => {
    const user = userEvent.setup();
    render(<Stopwatch showLaps={false} />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /^lap$/i }));

    expect(screen.queryByRole("heading", { name: /lap times/i })).not.toBeInTheDocument();
  });

  it("opens delete confirmation and removes a lap", async () => {
    const user = userEvent.setup();
    render(<Stopwatch />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /^lap$/i }));

    await waitFor(() => {
      expect(screen.getByTitle("Delete lap")).toBeInTheDocument();
    });

    await user.click(screen.getByTitle("Delete lap"));

    const dialog = screen.getByRole("heading", { name: /delete lap time/i }).closest("div")
      ?.parentElement?.parentElement as HTMLElement;
    expect(dialog).toBeTruthy();

    await user.click(within(dialog).getByRole("button", { name: /^delete$/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /lap times/i })).not.toBeInTheDocument();
    });
  });

  it("opens merge dialog and merges with adjacent lap", async () => {
    const user = userEvent.setup();
    render(<Stopwatch />);

    await user.click(screen.getByRole("button", { name: /^start$/i }));
    await user.click(screen.getByRole("button", { name: /^lap$/i }));
    await waitFor(() => {
      expect(screen.getByTitle("Merge lap")).toBeInTheDocument();
    });
    await user.click(screen.getByRole("button", { name: /^lap$/i }));

    await waitFor(() => {
      expect(screen.getByText(/^lap 2$/i)).toBeInTheDocument();
    });

    const mergeButtons = screen.getAllByTitle("Merge lap");
    await user.click(mergeButtons[0]);

    await waitFor(() => {
      expect(screen.getByRole("heading", { name: /merge lap time/i })).toBeInTheDocument();
    });

    await user.click(screen.getByRole("button", { name: /merge with lap 2/i }));

    await waitFor(() => {
      expect(screen.queryByRole("heading", { name: /merge lap time/i })).not.toBeInTheDocument();
    });

    expect(screen.getByText(/^lap 1$/i)).toBeInTheDocument();
    expect(screen.queryByText(/^lap 2$/i)).not.toBeInTheDocument();
  });
});
