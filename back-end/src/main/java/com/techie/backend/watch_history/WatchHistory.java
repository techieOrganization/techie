package com.techie.backend.watch_history;

import com.techie.backend.user.User;
import com.techie.backend.video.Video;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "watch_histories")
public class WatchHistory {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @JoinColumn(name = "video_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private Video video;
}
