package site.techieloud.backend.playlist.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlaylistRequest {

    @Data
    public static class CreatePlaylist {
        private String playlistName;
        private String videoId;
    }

    @Data
    public static class UpdatePlaylist {
        private String playlistName;
        private List<String> addVideoIds;
        private List<String> removeVideoIds;
    }
}