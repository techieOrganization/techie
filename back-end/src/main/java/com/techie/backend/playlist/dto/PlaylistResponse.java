package com.techie.backend.playlist.dto;

import com.techie.backend.video.domain.Video;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;

@Data
public class PlaylistResponse {

    @Data
    @NoArgsConstructor
    @AllArgsConstructor
    public static class Overview {
        private List<PlaylistSummary> playlists;

        @Data
        @NoArgsConstructor
        @AllArgsConstructor
        public static class PlaylistSummary {
            private Long playlistId;
            private String name;
        }
    }

    @Data
    public static class Details {
        private Long playlistId;
        private String playlistName;
        private List<PlaylistDetails> videos;
    }

    @Data
    public static class PlaylistDetails {
        private String videoId;
        private String title;
        private String category;

        public PlaylistDetails(Video video) {
            this.videoId = video.getVideoId();
            this.title = video.getTitle();
            this.category = String.valueOf(video.getCategory());
        }
    }

    @Data
    public static class UpdatePlaylist {
        private Long playlistId;
        private String name;

        public UpdatePlaylist(Long playlistId, String name) {
            this.playlistId = playlistId;
            this.name = name;
        }
    }
}