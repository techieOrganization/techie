package com.techie.backend.comment.service;


import com.techie.backend.comment.dto.CommentRequest;
import com.techie.backend.comment.dto.CommentResponse;
import com.techie.backend.global.security.UserDetailsCustom;

import java.util.List;

public interface CommentService {
    CommentResponse createComment(Long postId, CommentRequest commentRequest, UserDetailsCustom userDetails);

    List<CommentResponse> getCommentsByPostId(Long postId);

    void updateComment(Long postId, Long commentId, CommentRequest.Update updateRequest, UserDetailsCustom userDetailsCustom);
}
