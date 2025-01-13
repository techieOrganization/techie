package com.techie.backend.board.service;

import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.global.security.UserDetailsCustom;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;

public interface PostService {
    // CREATE
    public ResponseEntity<PostResponse> createPost(PostRequest postRequest, UserDetailsCustom userDetails);

    // READ
    public ResponseEntity<PostResponse> getPost(Long id, UserDetailsCustom userDetails);
    public Slice<PostResponse> getPostList(Pageable pageable, UserDetailsCustom userDetails);

    // UPDATE
    public ResponseEntity<PostResponse> updatePost(Long id, PostRequest postRequest, UserDetailsCustom userDetails);

    // DELETE
    public ResponseEntity<PostResponse> deletePost(Long id, UserDetailsCustom userDetails);
}
