package com.techie.backend.board.dto;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.domain.PostCategory;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class PostResponse {
    private Long id;
    private String title;
    private String content;
    private PostCategory category;
    private LocalDateTime writtenAt;
    private String email;
    private String nickname;

    public PostResponse(Post post) {
        this.title = post.getTitle();
        this.content = post.getContent();
        this.category = post.getCategory();
        this.writtenAt = post.getUpdatedAt();
        this.email = post.getUser().getEmail();
        this.nickname = post.getUser().getNickname();
        this.id = post.getId();
    }
}
