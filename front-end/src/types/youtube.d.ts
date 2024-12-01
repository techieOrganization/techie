declare namespace YT {
  class Player {
    constructor(elementId: string, options: PlayerOptions);
    getCurrentTime(): number;
    seekTo(seconds: number, allowSeekAhead: boolean): void;
    playVideo(): void;
    pauseVideo(): void;
    stopVideo(): void;
  }

  interface PlayerOptions {
    videoId: string;
    height?: string;
    width?: string;
    playerVars?: {
      autoplay?: 0 | 1;
      controls?: 0 | 1;
      mute?: 0 | 1;
      start?: number;
      end?: number;
      [key: string]: string | number | undefined;
    };
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
