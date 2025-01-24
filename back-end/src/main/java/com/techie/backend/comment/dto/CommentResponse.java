
package com.techie.backend.comment.dto;

import lombok.Data;

@Data
public class CommentResponse {
    private Long id;
    private String content;
    private String writerNickname;
    private Long postId;

    public CommentResponse(Long id, String content, String writerNickname, Long postId) {
        this.id = id;
        this.content = content;
        this.writerNickname = writerNickname;
        this.postId = postId;
    }

}