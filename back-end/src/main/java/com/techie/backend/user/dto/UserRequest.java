package com.techie.backend.user.dto;

import com.techie.backend.user.domain.Role;
import com.techie.backend.user.domain.User;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class UserRequest {

    private String email;
    private String password;
    private Role role;
    private String resultRole;

    @Data
    public static class Register {
        private String email;
        private String password;
        private String nickname;
    }

//    @Data
//    public static class Login {
//
//    }

    public UserRequest(
            User user) {
        this.email = user.getEmail();
        this.password = user.getPassword();
        this.role = user.getRole();
    }

    public User toEntity() {
        return User.builder()
                .email(this.email)
                .password(this.password)
                .role(role.USER)
                .build();
    }


    @Data
    public static class Update {
        private String email;
        private String nickname;
        private String currentPassword;
        private String newPassword;
    }
}
