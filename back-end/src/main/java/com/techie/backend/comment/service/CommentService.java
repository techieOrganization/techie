package com.techie.backend.comment.service;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.repository.PostRepository;
import com.techie.backend.comment.dto.CommentRequest;
import com.techie.backend.comment.dto.CommentResponse;
import com.techie.backend.comment.repository.CommentRepository;
import com.techie.backend.global.mapper.CommentMapper;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class CommentService {
    private final CommentRepository commentRepository;
    private final PostRepository postRepository;
    private final UserService userService;
    private final CommentMapper commentMapper;

    public CommentResponse createComment(Long postId,
                                         CommentRequest commentRequest,
                                         UserDetailsCustom userDetails) {

        User user = userService.getUserFromSecurityContext(userDetails);

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        com.techie.backend.comment.domain.Comment comment = commentMapper.toEntity(commentRequest, post, user);
        com.techie.backend.comment.domain.Comment createComment = commentRepository.save(comment);

        return commentMapper.toDto(createComment);
    }

    public List<CommentResponse> getCommentsByPostId(Long postId) {

        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new EntityNotFoundException("게시글을 찾을 수 없습니다."));

        List<com.techie.backend.comment.domain.Comment> comments = commentRepository.findByPost(post);

        return comments.stream()
                .map(commentMapper::toDto)
                .collect(Collectors.toList());
    }

    public void updateComment(Long postId,
                              Long commentId,
                              CommentRequest.Update updateRequest,
                              UserDetailsCustom userDetailsCustom) {

        com.techie.backend.comment.domain.Comment comment = commentRepository.findCommentByPostIdAndCommentId(postId, commentId)
                .orElseThrow(() -> new EntityNotFoundException("해당 게시물에 댓글이 존재하지 않습니다."));

        User user = userService.getUserFromSecurityContext(userDetailsCustom);

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new SecurityException("댓글 작성자가 아닙니다.");
        }

        comment.updateContent(updateRequest.getContent());
    }

    public void deleteComment(Long postId,
                              Long commentId,
                              UserDetailsCustom userDetailsCustom) {

        com.techie.backend.comment.domain.Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new EntityNotFoundException("댓글을 찾을 수 없습니다."));
        User user = userService.getUserFromSecurityContext(userDetailsCustom);

        if (!comment.getUser().getId().equals(user.getId())) {
            throw new SecurityException("댓글 작성자가 아닙니다.");
        }
        commentRepository.delete(comment);
    }
}