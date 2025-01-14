package com.techie.backend.board.service;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.repository.PostRepository;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.service.UserService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional
public class PostServiceImpl implements PostService {
    private final UserService userService;
    private final PostRepository postRepository;

    @Override
    public PostResponse createPost(PostRequest postRequest, UserDetailsCustom userDetails) {
        User user = userService.getUserFromSecurityContext(userDetails);
        Post post = Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .user(user)
                .category(postRequest.getCategory())
                .build();

        postRepository.save(post);
        return new PostResponse(post);
    }

    @Override
    public PostResponse getPost(Long id, UserDetailsCustom userDetails) {
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
