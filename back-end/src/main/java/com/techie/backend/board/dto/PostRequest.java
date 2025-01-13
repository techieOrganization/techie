package com.techie.backend.board.dto;

import com.techie.backend.board.domain.PostCategory;
import lombok.Data;

@Data
public class PostRequest {
    private String title;
    private String content;
    private PostCategory category;
}
