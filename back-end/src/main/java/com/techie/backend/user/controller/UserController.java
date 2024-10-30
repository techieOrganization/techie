package com.techie.backend.user.controller;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;
import com.techie.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@Tag(name = "사용자 인증 API", description = "사용자 인증 및 로그아웃 관련 API 엔드포인트")
@RequestMapping("/api/users")
@CrossOrigin(origins = "http://localhost:3000")
@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserService userService;

    @PostMapping("/register")
    public ResponseEntity<UserResponse.Information> register(@RequestBody UserRequest.Register userRequest) {
        UserResponse.Information userInfo = userService.register(userRequest);
        return ResponseEntity.ok(userInfo);
    }

    @GetMapping("/me")
    public ResponseEntity<UserResponse.Information> getLoggedInUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getLoggedInUser(userDetails));
    }

    @PutMapping("/me")
    public ResponseEntity<Boolean> updateUserInfo(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UserRequest.Update userRequest) {
        return ResponseEntity.ok(userService.updateUser(userDetails, userRequest));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Boolean> deleteUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.deleteUser(userDetails));
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
