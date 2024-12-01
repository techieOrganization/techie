package com.techie.backend.playlist_video.repository;

import com.techie.backend.playlist_video.domain.PlaylistVideo;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistVideoRepository extends JpaRepository<PlaylistVideo, Long>, PlaylistVideoRepositoryCustom {
}