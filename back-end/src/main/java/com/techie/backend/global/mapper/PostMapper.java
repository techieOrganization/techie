package com.techie.backend.global.mapper;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.dto.PostRequest;
import com.techie.backend.board.dto.PostResponse;
import com.techie.backend.user.domain.User;
import org.springframework.stereotype.Component;

@Component
public class PostMapper {
    public Post toEntity(PostRequest postRequest, User user) {
        return Post.builder()
                .title(postRequest.getTitle())
                .content(postRequest.getContent())
                .category(postRequest.getCategory())
                .user(user)
                .build();
    }

    public PostResponse toDto(Post post) {
        return new PostResponse(post);
    }

    public void updateDto(PostRequest.Update updateRequest, Post post) {
        post.changeTitle(updateRequest.getTitle());
        post.changeContent(updateRequest.getContent());
    }

}
