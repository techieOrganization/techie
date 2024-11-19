package com.techie.backend.playlist_video.repository;


import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.playlist_video.domain.PlaylistVideo;
import com.techie.backend.video.domain.Video;

import java.util.Optional;

public interface PlaylistVideoRepositoryCustom {
    boolean existsByPlaylistAndVideo(Playlist playlist, Video video);

    Optional<PlaylistVideo> findByPlaylistAndVideo(Playlist playlist, Video video);
}