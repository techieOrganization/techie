package com.techie.backend.playlist.dto;

import lombok.Data;

import java.util.List;

@Data
public class PlaylistRequest {

    @Data
    public static class CreatePlaylist {
        private String name;
        private List<String> videoIds;
    }

    @Data
    public static class UpdatePlaylist {
        private String name;
        private List<String> addVideoIds;
        private List<String> removeVideoIds;
    }
}