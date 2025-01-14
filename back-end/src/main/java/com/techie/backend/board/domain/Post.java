package com.techie.backend.board.domain;

import com.techie.backend.global.BaseTime;
import com.techie.backend.user.domain.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AccessLevel;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Table(name = "posts")
@Entity
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
public class Post extends BaseTime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column @NotBlank(message = "제목은 비어있을 수 없습니다.")
    private String title;

    @Column @Lob @NotBlank(message = "내용은 비어있을 수 없습니다.")
    private String content;

    @JoinColumn(name = "user_id", nullable = false)
    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    @Column @NotNull
    @Enumerated(EnumType.STRING)
    private PostCategory category;

    @Builder
    public Post(String title, String content, User user, PostCategory category) {
        this.title = title;
        this.content = content;
        this.user = user;
        this.category = category;
    }

    public void changeTitle(String title) {
        this.title = title;
    }

    public void changeContent(String content) {
        this.content = content;
    }
}
