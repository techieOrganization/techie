package com.techie.backend.user.domain;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder(toBuilder = true)
@NoArgsConstructor
@AllArgsConstructor
@Table(name = "users",
uniqueConstraints = {@UniqueConstraint(columnNames = {"email", "provider"})})
public class User {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String email;

    private String password;

    @Column(nullable = false)
    private String nickname;

    @Column(nullable = false)
    private String role;

    private String provider;

    // 로컬 로그인용
    public static User createLocalUser(String email, String password, String nickname, String role) {
        return User.builder()
                .email(email)
                .password(password)
                .nickname(nickname)
                .role(role)
                .build();
    }

    // 소셜 로그인용
    public static User createSocialUser(String email, String nickname, String role, String provider) {
        return User.builder()
                .email(email)
                .nickname(nickname)
                .role(role)
                .provider(provider)
                .build();
    }
}