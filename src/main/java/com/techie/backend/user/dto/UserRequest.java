package com.techie.backend.user.dto;

import lombok.Data;
import org.springframework.stereotype.Component;

@Data
@Component
public class UserRequest {

    private Long id;
    private String nickname;
    private String password;
}
