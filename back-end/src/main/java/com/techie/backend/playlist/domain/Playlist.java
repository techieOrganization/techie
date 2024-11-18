package com.techie.backend.playlist.domain;

import com.techie.backend.global.exception.playlist.VideoNotFoundException;
import com.techie.backend.playlist_video.domain.PlaylistVideo;
import com.techie.backend.playlist_video.repository.PlaylistVideoRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.video.domain.Video;
import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Table(name = "playlists")
@Entity
@Getter
@RequiredArgsConstructor
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @OneToMany(mappedBy = "playlist", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlaylistVideo> playlistVideos = new ArrayList<>();

    @Builder
    public Playlist(String name, User user) {
        this.name = name;
        this.user = user;
    }

    public void addVideo(Video video) {
        PlaylistVideo playlistVideo = new PlaylistVideo(this, video);
        playlistVideos.add(playlistVideo);
    }

    public void updateName(String newName) {
        if (newName == null || newName.isBlank()) {
            throw new IllegalArgumentException("이름은 비어있을 수 없습니다.");
        }
        this.name = newName;
    }

    public void removeVideo(Video video, PlaylistVideoRepository playlistVideoRepository) {
        PlaylistVideo playlistVideo = playlistVideoRepository.findByPlaylistAndVideo(this, video)
                .orElseThrow(VideoNotFoundException::new);

        playlistVideos.remove(playlistVideo);
    }

    public boolean hasVideo(Video video, PlaylistVideoRepository playlistVideoRepository) {
        return playlistVideoRepository.existsByPlaylistAndVideo(this, video);
    }
}