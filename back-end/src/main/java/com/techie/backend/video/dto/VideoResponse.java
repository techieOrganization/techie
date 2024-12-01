package com.techie.backend.video.dto;

import lombok.Data;

import java.time.LocalDateTime;
import java.util.Map;


@Data
public class VideoResponse {
    private String videoId;
    private String title;
    private String description;
    private String channelTitle;
    private LocalDateTime publishedAt;
    private String duration;
    private Map<String, Thumbnail> thumbnails;

    @Data
    public static class Thumbnail {
        private String url;
        private int width;
        private int height;
    }

}

