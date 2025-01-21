package com.techie.backend.board.controller;

import com.techie.backend.board.domain.PostCategory;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.service.PostServiceImpl;
import com.techie.backend.global.security.UserDetailsCustom;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

/*
TODO
 1. 나의 글 찾기 V
 2. 다른 유저 글 찾기 V
 3. 모든 글 찾기 V
 4. 제목+내용 글 찾기
 ----------------
 5. 글 작성하기 V
 6. 글 수정하기 V
 7. 글 삭제하기 V
 */

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")
@Slf4j
public class PostController {

    private final PostServiceImpl postServiceImpl;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) {
        PostResponse postResponse = postServiceImpl.createPost(postRequest, userDetails);
        return ResponseEntity.ok(postResponse);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PostResponse>> getMyPosts(@AuthenticationPrincipal UserDetailsCustom userDetails,
                                                         Pageable pageable) {
        Page<PostResponse> myPosts = postServiceImpl.getMyPosts(userDetails, pageable);
        return ResponseEntity.ok(myPosts);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Page<PostResponse>> getYourPosts(@PathVariable Long id,
                                                           Pageable pageable) {
        Page<PostResponse> yourPosts = postServiceImpl.getYourPosts(id, pageable);
        return ResponseEntity.ok(yourPosts);
    }

    @GetMapping("category/{category}")
    public ResponseEntity<Page<PostResponse>> getPostsByCategory(@PathVariable("category") PostCategory category,
                                                                 Pageable pageable) {
        Page<PostResponse> posts = postServiceImpl.getAllPosts(category, pageable);
        return ResponseEntity.ok(posts);
    }


    @PutMapping("/{id}")
    public ResponseEntity<PostResponse> updatePost(@RequestBody PostRequest.Update updateRequest,
                                                   @PathVariable Long id,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) {
        PostResponse postResponse = postServiceImpl.updatePost(id, updateRequest, userDetails);
        return ResponseEntity.ok(postResponse);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePost(@PathVariable Long id,
                                           @AuthenticationPrincipal UserDetailsCustom userDetails) {
        postServiceImpl.deletePost(id, userDetails);
        return ResponseEntity.noContent().build();
    }
}
