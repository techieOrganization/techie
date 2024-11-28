package site.techieloud.backend.memo.domain;

import site.techieloud.backend.global.BaseTime;
import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.video.domain.Video;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
@Table(name  = "memo")
public class Memo extends BaseTime {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(nullable = true)
    private String title;

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

    public void assignVideo(Video video) {
        this.video = video;
    }

    public void changeTitle(String title) {
        this.title = title;
    }

    public void changeContent(String content) {
        this.content = content;
    }
}
