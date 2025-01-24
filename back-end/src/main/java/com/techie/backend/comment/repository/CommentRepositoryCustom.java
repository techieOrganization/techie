package com.techie.backend.comment.repository;

import com.techie.backend.comment.domain.Comment;

import java.util.Optional;

public interface CommentRepositoryCustom {
    Optional<Comment> findCommentByPostIdAndCommentId(Long postId, Long commentId);

}
