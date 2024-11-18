package com.techie.backend.playlist_video.repository;

import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.playlist_video.domain.PlaylistVideo;
import com.techie.backend.video.domain.Video;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PlaylistVideoRepository extends JpaRepository<PlaylistVideo, Long> {
    boolean existsByPlaylistAndVideo(Playlist playlist, Video video);

    Optional<PlaylistVideo> findByPlaylistAndVideo(Playlist playlist, Video video);
}