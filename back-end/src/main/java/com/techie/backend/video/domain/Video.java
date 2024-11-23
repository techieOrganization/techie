package com.techie.backend.video.domain;

import com.techie.backend.playlist_video.domain.PlaylistVideo;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.ArrayList;
import java.util.List;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "video")
public class Video {

    @Id
    private String videoId;

    @Column(nullable = true)
    private String title;

    @Enumerated(EnumType.STRING)
    @Column(nullable = true)
    private Category category;

    @OneToMany(mappedBy = "video", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<PlaylistVideo> playlistVideos = new ArrayList<>();

    public Video(String videoId){
        this.videoId = videoId;
    }
}