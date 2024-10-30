package com.techie.backend.user.dto;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class UserResponse {

    @Data
    public static class Information {
        private String email;
        private String nickname;
        private LocalDateTime createdDate;
        private LocalDateTime modifiedDate;
    }


}
