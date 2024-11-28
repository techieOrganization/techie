package site.techieloud.backend.playlist_video.domain;

import site.techieloud.backend.playlist.domain.Playlist;
import site.techieloud.backend.video.domain.Video;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "playlist_video")
@Entity
@Getter
@NoArgsConstructor
public class PlaylistVideo {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "playlist_id", nullable = false)
    private Playlist playlist;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "video_id", nullable = false)
    private Video video;

    public PlaylistVideo(Playlist playlist, Video video) {
        this.playlist = playlist;
        this.video = video;
    }
}