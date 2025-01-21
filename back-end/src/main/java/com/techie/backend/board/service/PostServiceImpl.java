package com.techie.backend.board.service;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.repository.PostRepository;
import com.techie.backend.global.mapper.PostMapper;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.service.UserService;
import jakarta.persistence.EntityManager;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
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
    private final EntityManager em;

    @Override
    public PostResponse createPost(PostRequest postRequest, UserDetailsCustom userDetails) {
        User user = userService.getUserFromSecurityContext(userDetails);
        Post post = postMapper.toEntity(postRequest, user);
        Post createdPost = postRepository.save(post);
        return postMapper.toDto(createdPost);
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
    public PostResponse updatePost(Long id, PostRequest.Update updateRequest, UserDetailsCustom userDetails) {
        Post post = postRepository.findById(id).orElseThrow(()
                                            -> new EntityNotFoundException("게시글이 없습니다."));
        User user = userService.getUserFromSecurityContext(userDetails);

        validateOwner(user, post);

        postMapper.updateDto(updateRequest, post);
        em.flush(); // 수정 사항 바로 반영

        return postMapper.toDto(post);
    }


    @Override
    public void deletePost(Long id, UserDetailsCustom userDetails) {
        Post post = postRepository.findById(id).orElseThrow(() 
                                                -> new EntityNotFoundException("게시글이 없습니다."));
        User user = userService.getUserFromSecurityContext(userDetails);
        validateOwner(user, post);
        postRepository.delete(post);
    }

    private void validateOwner(User user, Post post) {
        if(!user.getId().equals(post.getUser().getId())) {
            throw new AccessDeniedException("수정/삭제할 권한이 없습니다.");
        }
    }
}
