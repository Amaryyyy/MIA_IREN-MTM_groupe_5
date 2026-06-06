type TimerEntry = { type: "interval" | "timeout"; id: ReturnType<typeof setInterval> };
type ListenerEntry = {
  target: EventTarget;
  event: string;
  handler: EventListenerOrEventListenerObject;
};

export class GameManager {
  isRunning = false;
  private timers: TimerEntry[] = [];
  private listeners: ListenerEntry[] = [];
  private frames: number[] = [];

  addInterval(timerId: ReturnType<typeof setInterval> | null | undefined) {
    if (timerId != null) {
      this.timers.push({ type: "interval", id: timerId });
    }
    return timerId;
  }

  addTimeout(timerId: ReturnType<typeof setTimeout> | null | undefined) {
    if (timerId != null) {
      this.timers.push({ type: "timeout", id: timerId });
    }
    return timerId;
  }

  addAnimationFrame(frameId: number | null | undefined) {
    if (frameId != null) {
      this.frames.push(frameId);
    }
    return frameId;
  }

  addEventListener(
    target: EventTarget | null | undefined,
    event: string,
    handler: EventListenerOrEventListenerObject
  ) {
    if (!target) return;
    this.listeners.push({ target, event, handler });
    target.addEventListener(event, handler);
  }

  cleanup() {
    this.isRunning = false;

    this.timers.forEach(({ type, id }) => {
      try {
        if (type === "interval") {
          clearInterval(id);
        } else {
          clearTimeout(id);
        }
      } catch {
        // Ignorer les erreurs
      }
    });
    this.timers = [];

    this.frames.forEach((frameId) => {
      try {
        cancelAnimationFrame(frameId);
      } catch {
        // Ignorer les erreurs
      }
    });
    this.frames = [];

    this.listeners.forEach(({ target, event, handler }) => {
      try {
        target.removeEventListener(event, handler);
      } catch {
        // Ignorer les erreurs
      }
    });
    this.listeners = [];
  }

  reset() {
    this.cleanup();
    this.isRunning = false;
  }

  startGame() {
    this.reset();
    this.isRunning = true;
  }
}

export const gameManager = new GameManager();
