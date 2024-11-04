package com.techie.backend.user.dto;

import lombok.Data;
import lombok.Getter;
import lombok.Setter;

@Data
public class UserRequest {
    private String email;
    private String password;
    private String nickname;

    @Data
    public static class Register {
        private String email;
        private String password;
        private String nickname;
    }
//
//    @Data
//    public static class Login {
//        private String username;
//        private String password;
//    }
//
//    @Data
//    public static class Update {
//        private String email;
//        private String nickname;
//        private String currentPassword;
//        private String newPassword;
//    }
}
