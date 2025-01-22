package com.techie.backend.board.dto;

import com.techie.backend.board.domain.PostCategory;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class PostRequest {
    private String title;
    private String content;
    private PostCategory category;

    @Data
    public static class Update {
        private String title;
        private String content;
    }

    @Data
    public static class Delete {
        private List<Long> postIds = new ArrayList<>();
    }
}
