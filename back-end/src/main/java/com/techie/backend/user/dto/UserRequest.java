package com.techie.backend.user.dto;

import lombok.Data;

@Data
public class UserRequest {

    @Data
    public static class Register {
        private String email;
        private String password;
        private String nickname;
    }

    @Data
    public static class Login {
        private String email;
        private String password;
    }

    @Data
    public static class Update {
        private String email;
        private String nickname;
        private String currentPassword;
        private String newPassword;
    }
}
