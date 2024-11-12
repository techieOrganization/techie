export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface VideoSnippet {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard?: Thumbnail;
    maxres?: Thumbnail;
  };
}

export interface Video {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  videoId: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard?: Thumbnail;
    maxres?: Thumbnail;
  };
  snippet: VideoSnippet;
  category: string;
}
