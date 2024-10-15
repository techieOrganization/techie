package com.techie.backend.user.controller;

import com.techie.backend.user.service.UserService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Tag(name = "getApi", description = "test")
@RequestMapping("/api/users")
@RequiredArgsConstructor
@RestController
public class UserController {
    private final UserDetailsService userDetailsService;


    @GetMapping("/authFail")
    public ResponseEntity<String> authFail() {
        return ResponseEntity.status(401).body("logIn Failed");
    }

    @GetMapping("logOutSuccess")
    public ResponseEntity<String> logOutSuccess() {
        return ResponseEntity.ok("Logged out successfully");
    }

}
