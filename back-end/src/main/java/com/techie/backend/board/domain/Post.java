package com.techie.backend.board.domain;

import com.techie.backend.global.BaseTime;
import com.techie.backend.user.domain.User;
import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Table(name = "posts")
@Entity
@Getter
@RequiredArgsConstructor
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
}
