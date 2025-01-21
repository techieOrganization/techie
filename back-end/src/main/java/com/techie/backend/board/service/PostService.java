package com.techie.backend.board.service;

import com.techie.backend.board.domain.PostCategory;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.global.security.UserDetailsCustom;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface PostService {
    // CREATE
    public PostResponse createPost(PostRequest postRequest, UserDetailsCustom userDetails);
    // READ
    public Page<PostResponse> getMyPosts(UserDetailsCustom userDetails, Pageable pageable);
    public Page<PostResponse> getYourPosts(Long userId, Pageable pageable);
    Page<PostResponse> getAllPosts(PostCategory category, Pageable pageable);

    // UPDATE
    public PostResponse updatePost(Long id, PostRequest.Update updateRequest, UserDetailsCustom userDetails);

    // DELETE
    public void deletePost(Long id, UserDetailsCustom userDetails);
}
