package com.techie.backend.user.controller;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;
import com.techie.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "사용자 인증 API", description = "사용자 인증 및 로그아웃 관련 API 엔드포인트")
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping("/join")
    public ResponseEntity<Boolean> register(@RequestBody UserRequest.Register request) {
        return ResponseEntity.ok(userService.joinProcess(request));
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse.Information> getUser(@AuthenticationPrincipal UserDetailsCustom userDetails) {
        return ResponseEntity.ok(userService.getUser(userDetails));
    }

    @PutMapping("/me")
    public ResponseEntity<Boolean> updateUser(@AuthenticationPrincipal UserDetailsCustom userDetails, @RequestBody UserRequest.Update request) {
        return ResponseEntity.ok(userService.updateUser(userDetails, request));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Boolean> deleteUser(@AuthenticationPrincipal UserDetailsCustom userDetails) {
        return ResponseEntity.ok(userService.deleteUser(userDetails.getUsername()));
    }
}