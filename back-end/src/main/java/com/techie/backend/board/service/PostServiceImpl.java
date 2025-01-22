package com.techie.backend.board.service;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.domain.PostCategory;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.board.repository.PostRepository;
import com.techie.backend.global.exception.user.NoChangesException;
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

import java.util.List;

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
    public Page<PostResponse> getMyPosts(UserDetailsCustom userDetails, Pageable pageable) {
        User user = userService.getUserFromSecurityContext(userDetails);
        return getPosts(user, pageable);
    }

    @Override
    public Page<PostResponse> getYourPosts(Long userId, Pageable pageable) {
        User user = userService.getUserById(userId);
        return getPosts(user, pageable);
    }

    public Page<PostResponse> getPosts(User user, Pageable pageable) {
        Page<Post> posts = postRepository.searchAllByUser(pageable, user);
        if(posts.isEmpty()) {
            throw new EntityNotFoundException("해당 사용자의 게시물이 없습니다.");
        }
        return posts.map(postMapper::toDto);
    }

    @Override
    public Page<PostResponse> getAllPosts(PostCategory category, Pageable pageable) {
        // 게시글이 없다면 빈 페이지 반환
        return postRepository.searchAllByCategory(pageable, category).map(postMapper::toDto);
    }

    public Page<PostResponse> searchPost(PostCategory postCategory, String query, Pageable pageable) {
        // 게시글이 없다면 빈 페이지 반환
        return postRepository.searchByQuery(pageable, postCategory, query).map(postMapper::toDto);
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
    @Transactional
    public void deletePost(PostRequest.Delete delRequest, UserDetailsCustom userDetails) {
        List<Long> postIds = delRequest.getPostIds();
        if(postIds == null || postIds.isEmpty()) {
            throw new NoChangesException();
        }
        User user = userService.getUserFromSecurityContext(userDetails);
        postRepository.deleteAllByIds(postIds, user.getId());
    }

    private void validateOwner(User user, Post post) {
        if(!user.getId().equals(post.getUser().getId())) {
            throw new AccessDeniedException("수정/삭제할 권한이 없습니다.");
        }
    }
}
