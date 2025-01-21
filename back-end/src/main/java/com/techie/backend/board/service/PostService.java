package com.techie.backend.board.service;

import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.global.security.UserDetailsCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    // CREATE
    public PostResponse createPost(PostRequest postRequest, UserDetailsCustom userDetails);
    // READ
    public Page<PostResponse> getMyPost(Pageable pageable, UserDetailsCustom userDetails);
    public PostResponse getPostById(Long postId, UserDetailsCustom userDetails);
    public Page<PostResponse> getPostList(Pageable pageable, UserDetailsCustom userDetails);

    // UPDATE
    public PostResponse updatePost(Long id, PostRequest.Update updateRequest, UserDetailsCustom userDetails);

    // DELETE
    public void deletePost(Long id, UserDetailsCustom userDetails);
}
