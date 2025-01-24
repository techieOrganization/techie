package com.techie.backend.comment.repository;

import com.techie.backend.board.domain.Post;
import com.techie.backend.comment.domain.Comment;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CommentRepository extends JpaRepository<Comment, Long>, CommentRepositoryCustom {
    List<Comment> findByPost(Post post);

    Optional<Comment> findByIdAndPostId(Long commentId, Long postId);
}