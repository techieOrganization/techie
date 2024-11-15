package com.techie.backend.playlist.repository;

import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.user.domain.User;
import com.techie.backend.video.dto.VideoResponse;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long>, PlaylistRepositoryCustom {
}
