package com.techie.backend.user.controller;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@Tag(name = "사용자 인증 API", description = "사용자 인증 및 로그아웃 관련 API 엔드포인트")
@RequestMapping("/api/users")
@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;


    @PostMapping("/register")
    public ResponseEntity<Boolean> register(@RequestBody UserRequest userRequest) {
        return ResponseEntity.ok(userService.register(userRequest));
    }

    @GetMapping("/authFail")
    public ResponseEntity<String> authFail() {
        return ResponseEntity.status(401).body("logIn Failed");
    }

    @GetMapping("logOutSuccess")
    public ResponseEntity<String> logOutSuccess() {
        return ResponseEntity.ok("Logged out successfully");
    }

}
