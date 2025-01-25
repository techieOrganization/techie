package com.techie.backend.global.mapper;

import com.techie.backend.board.domain.Post;
import com.techie.backend.comment.domain.Comment;
import com.techie.backend.comment.dto.CommentRequest;
import com.techie.backend.comment.dto.CommentResponse;
import com.techie.backend.user.domain.User;
import org.springframework.stereotype.Component;

@Component
public class CommentMapper {

    public Comment toEntity(CommentRequest commentRequest, Post post, User user) {
        return Comment.builder()
                .content(commentRequest.getContent())
                .post(post)
                .user(user)
                .build();
    }

    public CommentResponse toDto(Comment comment) {
        return new CommentResponse(comment);
    }
}
