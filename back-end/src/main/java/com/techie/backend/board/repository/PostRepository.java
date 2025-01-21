package com.techie.backend.board.repository;

import com.techie.backend.board.domain.Post;
import com.techie.backend.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> searchAllByUser(Pageable pageable, User user);
}
