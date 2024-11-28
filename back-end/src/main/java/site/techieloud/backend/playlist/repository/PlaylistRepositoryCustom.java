package site.techieloud.backend.playlist.repository;

import site.techieloud.backend.playlist.domain.Playlist;
import site.techieloud.backend.user.domain.User;

import java.util.List;

public interface PlaylistRepositoryCustom {
    Playlist findByUserIdAndId(Long userId, Long playlistId);
    List<Playlist> findAllByUser(User user);
    Playlist findByIdAndUser(Long playlistId, User user);
}