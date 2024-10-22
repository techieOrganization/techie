package com.techie.backend.video.repository;

import com.techie.backend.video.domain.Category;
import com.techie.backend.video.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface VideoRepository extends JpaRepository<Video, Long> {
    List<Video> findByCategory(Category category);
    List<Video> findByTitleContaining(String keyword);
}