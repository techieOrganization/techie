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
  duration?: string;
}

export interface Video {
  title: string;
  description: string;
  channelTitle: string;
  publishedAt: string;
  duration?: string;
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
  contentDetails: {
    videoId: string;
    duration?: string;
  };
}

export interface PlaylistResponse {
  kind: string;
  etag: string;
  nextPageToken?: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    snippet: VideoSnippet;
    contentDetails: {
      videoId: string;
      videoPublishedAt: string;
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface ChannelResponse {
  kind: string;
  etag: string;
  items: {
    kind: string;
    etag: string;
    id: string;
    contentDetails: {
      relatedPlaylists: {
        uploads: string;
      };
    };
  }[];
  pageInfo: {
    totalResults: number;
    resultsPerPage: number;
  };
}

export interface FetchVideosOptions {
  category?: string;
  query?: string;
  page?: number;
}

export interface Sort {
  sorted: boolean;
  unsorted: boolean;
  empty: boolean;
}

export interface Pageable {
  sort: Sort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  paged: boolean;
  unpaged: boolean;
}

export interface ApiResponse {
  content: Video[];
  pageable: Pageable;
  size: number;
  number: number;
  sort: Sort;
  numberOfElements: number;
  first: boolean;
  last: boolean;
  empty: boolean;
}
