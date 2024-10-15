package com.techie.backend.video.repository;

import com.techie.backend.video.domain.Category;
import com.techie.backend.video.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, Long> {
    Optional<Video> findByCategory(Category category);
}
