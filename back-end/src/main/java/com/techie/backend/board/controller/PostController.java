package com.techie.backend.board.controller;

import com.techie.backend.board.domain.PostCategory;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.service.PostService;
import com.techie.backend.global.security.UserDetailsCustom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;


@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
@Slf4j
public class PostController {

    private final PostService postService;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) {
        PostResponse postResponse = postService.createPost(postRequest, userDetails);
        return ResponseEntity.ok(postResponse);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PostResponse>> getMyPosts(@AuthenticationPrincipal UserDetailsCustom userDetails,
                                                         Pageable pageable) {
        Page<PostResponse> myPosts = postService.getMyPosts(userDetails, pageable);
        return ResponseEntity.ok(myPosts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page<PostResponse>> getYourPosts(@PathVariable Long id,
                                                           Pageable pageable) {
        Page<PostResponse> yourPosts = postService.getYourPosts(id, pageable);
        return ResponseEntity.ok(yourPosts);
    }

    @GetMapping("category/{category}")
    public ResponseEntity<Page<PostResponse>> getPostsByCategory(@PathVariable PostCategory category,
                                                                 Pageable pageable) {
        Page<PostResponse> posts = postService.getAllPosts(category, pageable);
        return ResponseEntity.ok(posts);
    }

    @GetMapping
    public ResponseEntity<Page<PostResponse>> searchPost(@RequestParam PostCategory category,
                                                         @RequestParam String query,
                                                         Pageable pageable) {
        Page<PostResponse> posts = postService.searchPost(category, query, pageable);
        return ResponseEntity.ok(posts);
    }

    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@RequestBody PostRequest.Update updateRequest,
                                                   @PathVariable Long id,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) {
        PostResponse postResponse = postService.updatePost(id, updateRequest, userDetails);
        return ResponseEntity.ok(postResponse);
    }

    @DeleteMapping
    public ResponseEntity<Void> deletePost(@RequestBody PostRequest.Delete delRequest,
                                           @AuthenticationPrincipal UserDetailsCustom userDetails) {
        postService.deletePost(delRequest, userDetails);
        return ResponseEntity.noContent().build();
    }
}
