package com.techie.backend.comment.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.techie.backend.board.domain.QPost;
import com.techie.backend.comment.domain.Comment;
import com.techie.backend.comment.domain.QComment;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
@RequiredArgsConstructor
public class CommentRepositoryImpl implements CommentRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Optional<Comment> findCommentByPostIdAndCommentId(Long postId, Long commentId) {
        QComment comment = QComment.comment;
        QPost post = QPost.post;

        Comment result = queryFactory
                .selectFrom(comment)
                .where(comment.id.eq(commentId)
                        .and(comment.post.id.eq(postId)))
                .fetchOne();

        return Optional.ofNullable(result);
    }
}
