package site.techieloud.backend.playlist.repository;

import site.techieloud.backend.playlist.domain.Playlist;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PlaylistRepository extends JpaRepository<Playlist, Long>, PlaylistRepositoryCustom {}