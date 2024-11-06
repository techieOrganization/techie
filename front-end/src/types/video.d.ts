export interface Thumbnail {
  url: string;
  width: number;
  height: number;
}

export interface Video {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  duration: string;
  thumbnails: {
    default: Thumbnail;
    medium: Thumbnail;
    high: Thumbnail;
    standard?: Thumbnail;
    maxres?: Thumbnail;
  };
}
