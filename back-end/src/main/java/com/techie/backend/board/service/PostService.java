package com.techie.backend.board.service;

import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.global.security.UserDetailsCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

public interface PostService {
    // CREATE
    public PostResponse createPost(PostRequest postRequest, UserDetailsCustom userDetails);
    // READ
    public PostResponse getPost(Long id, UserDetailsCustom userDetails);
    public Page<PostResponse> getPostList(Pageable pageable, UserDetailsCustom userDetails);

    // UPDATE
    public PostResponse updatePost(Long id, PostRequest postRequest, UserDetailsCustom userDetails);

    // DELETE
    public PostResponse deletePost(Long id, UserDetailsCustom userDetails);
}
