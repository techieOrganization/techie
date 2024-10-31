package com.techie.backend.memo.domain;

import com.techie.backend.user.domain.User;
import com.techie.backend.video.domain.Video;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;

import java.time.LocalDateTime;

@NoArgsConstructor
@Getter
@Entity
@Table(name  = "memo")
public class Memo {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = true)
    private String content;

    @Column(nullable = true)
    private String title;

    @Column(nullable = false)
    @CreatedDate
    private LocalDateTime createDate;

    @Column(nullable = false)
    @LastModifiedDate
    private LocalDateTime modifyDate;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @JoinColumn(name = "video_id", nullable = true)
    @ManyToOne(fetch = FetchType.LAZY)
    private Video video;

    @Column(nullable = true)
    private String noteTime;

    public void assignUser(User user) {
        this.user = user;
    }
}
