package com.techie.backend.board.repository;

import com.techie.backend.board.domain.Post;
import com.techie.backend.board.domain.PostCategory;
import com.techie.backend.user.domain.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface PostRepository extends JpaRepository<Post, Long> {
    Page<Post> searchAllByUser(Pageable pageable, User user);
    Page<Post> searchAllByCategory(Pageable pageable, PostCategory category);

    @Query("""
           SELECT p FROM Post p
           WHERE p.category = :category
           AND (p.title LIKE %:query% OR p.content LIKE %:query%)
           """)
    Page<Post> searchByQuery(Pageable pageable, PostCategory category, @Param("query") String query);
}
