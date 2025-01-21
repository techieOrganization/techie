package com.techie.backend.board.controller;

import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.service.PostService;
import com.techie.backend.board.service.PostServiceImpl;
import com.techie.backend.global.security.UserDetailsCustom;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/post")

/*
TODO
 1. 나의 글 찾기 -> 수정 여부 표시 추가
 2. 다른 유저 글 찾기
 3. 모든 글 찾기
 4. 제목+내용 글 찾기
 ----------------
 5. 글 작성하기 V
 6. 글 수정하기
 7. 글 삭제하기
 */

public class PostController {

    private final PostService postService;
    private final PostServiceImpl postServiceImpl;

    @PostMapping
    public ResponseEntity<PostResponse> createPost(@RequestBody PostRequest postRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) {
        PostResponse postResponse = postService.createPost(postRequest, userDetails);
        return ResponseEntity.ok(postResponse);
    }

    @GetMapping("/my")
    public ResponseEntity<Page<PostResponse>> getMyPost(Pageable pageable,
                                                        @AuthenticationPrincipal UserDetailsCustom userDetails) {
        Page<PostResponse> myPosts = postServiceImpl.getMyPost(pageable, userDetails);
        return ResponseEntity.ok(myPosts);
    }
}
