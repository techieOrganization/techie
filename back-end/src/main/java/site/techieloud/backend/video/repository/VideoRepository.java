package site.techieloud.backend.video.repository;

import site.techieloud.backend.video.domain.Category;
import site.techieloud.backend.video.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface VideoRepository extends JpaRepository<Video, String> {
    List<Video> findByCategory(Category category);
    List<Video> findByTitleContaining(String keyword);
    Optional<Video> findByVideoId(String videoId);
}