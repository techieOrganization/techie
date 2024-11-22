package com.techie.backend.user.dto;

import lombok.Data;

@Data
public class UserRequest {

    @Data
    public static class Register {
        private String email;
        private String password;
        private String confirmPassword;
        private String nickname;
    }

    @Data
    public static class Update {
        private String nickname;
        private String oldPassword;
        private String newPassword;
    }
    @Data
    public static class Delete {
        private String password;
    }
}