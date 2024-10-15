package com.techie.backend.user.dto;

import jakarta.persistence.Column;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import lombok.Data;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Data
@Component
public class UserRequest {

    private Long id;
    private String username;
    private String nickname;
    private String password;
    private String email;
    private LocalDateTime createdDate;
    private LocalDateTime modifiedDate;

}
