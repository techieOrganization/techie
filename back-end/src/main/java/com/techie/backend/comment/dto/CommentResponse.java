
package com.techie.backend.comment.dto;

import com.techie.backend.comment.domain.Comment;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class CommentResponse {
    private String content;
    private String writerNickname;
    private LocalDateTime createDate;
    private LocalDateTime updatedDate;

    public CommentResponse(Comment comment) {
        this.content = comment.getContent();
        this.writerNickname = comment.getUser().getNickname();
        this.createDate = comment.getCreatedAt();
        this.updatedDate = comment.getUpdatedAt();
    }
}