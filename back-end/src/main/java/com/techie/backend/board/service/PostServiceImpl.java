package com.techie.backend.board.service;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.repository.PostRepository;
import com.techie.backend.global.mapper.PostMapper;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
@Slf4j
public class PostServiceImpl implements PostService {
    private final UserService userService;
    private final PostRepository postRepository;
    private final PostMapper postMapper;

    @Override
    public PostResponse createPost(PostRequest postRequest, UserDetailsCustom userDetails) {
        User user = userService.getUserFromSecurityContext(userDetails);
        Post post = postMapper.toEntity(postRequest, user);
        postRepository.save(post);
        return postMapper.toDto(post);
    }

    @Override
    public Page<PostResponse> getMyPost(Pageable pageable, UserDetailsCustom userDetails) {
        User user = userService.getUserFromSecurityContext(userDetails);
        return postRepository.searchAllByUser(pageable, user)
                .map(postMapper::toDto);
    }

    @Override
    public PostResponse getPostById(Long postId, UserDetailsCustom userDetails) {
        return null;
    }

    @Override
    public Page<PostResponse> getPostList(Pageable pageable, UserDetailsCustom userDetails) {
        return null;
    }

    @Override
    public PostResponse updatePost(Long id, PostRequest postRequest, UserDetailsCustom userDetails) {
        return null;
    }

    @Override
    public PostResponse deletePost(Long id, UserDetailsCustom userDetails) {
        return null;
    }
}
