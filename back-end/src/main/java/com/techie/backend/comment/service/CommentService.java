package com.techie.backend.comment.service;


import com.techie.backend.comment.dto.CommentRequest;
import com.techie.backend.comment.dto.CommentResponse;
import com.techie.backend.global.security.UserDetailsCustom;

public interface CommentService {
    CommentResponse createComment(Long postId, CommentRequest commentRequest, UserDetailsCustom userDetails);
}
