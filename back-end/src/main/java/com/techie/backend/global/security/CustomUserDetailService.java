package com.techie.backend.global.security;


import com.techie.backend.global.exception.user.UserNotFoundException;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.User;
import com.techie.backend.user.repository.UserRepository;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Service
public class CustomUserDetailService implements UserDetailsService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;


    @Autowired
    public CustomUserDetailService(UserRepository userRepository, PasswordEncoder passwordEncoder, ModelMapper modelMapper) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.modelMapper = modelMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public UserDetails loadUserByUsername(String username) throws UsernameNotFoundException {
        Optional<User> optionalUserEntity = userRepository.findByUsername(username);
        User userEntity = optionalUserEntity.orElseThrow(UserNotFoundException::new);
        UserRequest resultUser = new UserRequest();
        resultUser.setUsername(userEntity.getUsername());
        resultUser.setPassword(userEntity.getPassword());

        return new CustomUserDetails(resultUser);
    }
}
