package com.techie.backend.gpt.domain;

import com.techie.backend.user.domain.User;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@NoArgsConstructor
@Getter
@Entity
@Table(name = "gpt")
public class Gpt {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    @Column(nullable = false)
    private String request;

    @Column(nullable = false)
    private String response;

    @ManyToOne(fetch = FetchType.LAZY)
    private User user;

    public void updateRequest(String request) {
        this.request = request;
    }

    public void updateResponse(String response) {
        this.response = response;
    }

    public void assignUser(User user) {
        this.user = user;
    }
}