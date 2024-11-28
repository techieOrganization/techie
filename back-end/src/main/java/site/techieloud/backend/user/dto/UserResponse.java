package site.techieloud.backend.user.dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
public class UserResponse {

    @Data
    @AllArgsConstructor
    public static class Information {
        private String email;
        private String nickname;
    }
}