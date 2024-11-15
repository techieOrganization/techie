package com.techie.backend.playlist.repository;

import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.user.domain.User;

import java.util.List;

public interface PlaylistRepositoryCustom {

    Playlist findByUserIdAndId(Long userId, Long playlistId);
    List<Playlist> findAllByUser(User user);
    Playlist findByIdAndUser(Long playlistId, User user);
}