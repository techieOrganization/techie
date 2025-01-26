package com.techie.backend.comment.controller;

import com.techie.backend.comment.dto.CommentRequest;
import com.techie.backend.comment.dto.CommentResponse;
import com.techie.backend.comment.service.CommentService;
import com.techie.backend.global.security.UserDetailsCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/post/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {
    private final CommentService commentService;

    @PostMapping
    public ResponseEntity<CommentResponse> createComment(@PathVariable Long postId,
                                                         @RequestBody CommentRequest commentRequest,
                                                         @AuthenticationPrincipal UserDetailsCustom userDetails) {
        CommentResponse commentResponse = commentService.createComment(postId, commentRequest, userDetails);
        return ResponseEntity.ok(commentResponse);
    }

    @GetMapping
    public ResponseEntity<List<CommentResponse>> getComments(@PathVariable Long postId) {
        List<CommentResponse> commentResponses = commentService.getCommentsByPostId(postId);
        return ResponseEntity.ok(commentResponses);
    }

    @PutMapping("/{commentId}")
    public ResponseEntity<CommentResponse> updateComment(@PathVariable Long postId,
                                                         @PathVariable Long commentId,
                                                         @RequestBody CommentRequest.Update updateRequest,
                                                         @AuthenticationPrincipal UserDetailsCustom userDetailsCustom) {
        commentService.updateComment(postId, commentId, updateRequest, userDetailsCustom);
        return ResponseEntity.ok().build();
    }

    @DeleteMapping("/{commentId}")
    public ResponseEntity<Void> deleteComment(@PathVariable Long postId,
                                              @PathVariable Long commentId,
                                              @AuthenticationPrincipal UserDetailsCustom userDetailsCustom) {

        commentService.deleteComment(postId, commentId, userDetailsCustom);
        return ResponseEntity.noContent().build();
    }
}