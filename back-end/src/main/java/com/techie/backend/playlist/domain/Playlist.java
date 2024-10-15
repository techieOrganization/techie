package com.techie.backend.playlist.domain;

import com.techie.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "playlists")
public class Playlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @JoinColumn(name  = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;
}
