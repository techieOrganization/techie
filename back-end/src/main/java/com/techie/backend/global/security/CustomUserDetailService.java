package com.techie.backend.global.security;


import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;


@Service
@RequiredArgsConstructor
public class CustomUserDetailService implements UserDetailsService {
    private final UserRepository userRepository;


    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Optional<User> byEmail = userRepository.findByEmail(email);
        UserRequest dto = new UserRequest();
        dto.setEmail(byEmail.get().getEmail());
        dto.setPassword(byEmail.get().getPassword());
        dto.setRole(byEmail.get().getRole());

        return new CustomUserDetails(dto);
    }
}
