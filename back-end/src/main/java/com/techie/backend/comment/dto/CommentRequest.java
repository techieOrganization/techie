package com.techie.backend.comment.dto;

import lombok.Data;

@Data
public class CommentRequest {
    private String content;

    @Data
    public static class Update {
        private String content;
    }
}