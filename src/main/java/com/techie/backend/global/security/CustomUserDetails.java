package com.techie.backend.global.security;

import com.techie.backend.user.dto.UserRequest;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

public class CustomUserDetails implements UserDetails {

    private final UserRequest user;

    public CustomUserDetails(UserRequest request) {
        this.user = request;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return List.of();
    }

    @Override
    public String getUsername() {
        return user.getNickname();
    }

    @Override
    public String getPassword() {
        return user.getPassword();
    }
}
