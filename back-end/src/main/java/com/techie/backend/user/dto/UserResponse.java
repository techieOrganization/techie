package com.techie.backend.user.dto;

import lombok.Data;

@Data
public class UserResponse {

    public static class Information {
        private String email;
        private String nickname;

        public Information(String email, String nickname) {
            this.email = email;
            this.nickname = nickname;
        }
    }
}
