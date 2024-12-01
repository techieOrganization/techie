export {};

declare global {
  interface Window {
    YT: typeof YT;
    onYouTubeIframeAPIReady: () => void;
  }

  namespace YT {
    class Player {
      constructor(elementId: string, options: PlayerOptions);
      getCurrentTime(): number;
      seekTo(seconds: number, allowSeekAhead: boolean): void;
    }

    interface PlayerOptions {
      videoId: string;
      events?: PlayerEvents;
    }

    interface PlayerEvents {
      onReady?: (event: PlayerEvent) => void;
      onStateChange?: (event: PlayerStateChangeEvent) => void;
    }

    interface PlayerEvent {
      target: Player;
    }

    interface PlayerStateChangeEvent extends PlayerEvent {
      data: number;
    }

    const PlayerState: {
      UNSTARTED: number;
      ENDED: number;
      PLAYING: number;
      PAUSED: number;
      BUFFERING: number;
      CUED: number;
    };
  }
}
