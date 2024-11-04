package com.techie.backend.user.controller;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
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

//    @GetMapping("/me")
//    public ResponseEntity<UserResponse.Information> getLoggedInUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
//        return ResponseEntity.ok(userService.getLoggedInUser(userDetails));
//    }
//
//    @PutMapping("/me")
//    public ResponseEntity<Boolean> updateUserInfo(@AuthenticationPrincipal UserDetails userDetails, @RequestBody UserRequest.Update userRequest) {
//        return ResponseEntity.ok(userService.updateUser(userDetails, userRequest));
//    }
//
//    @DeleteMapping("/me")
//    public ResponseEntity<Boolean> deleteUserInfo(@AuthenticationPrincipal UserDetails userDetails) {
//        return ResponseEntity.ok(userService.deleteUser(userDetails));
//    }


}
