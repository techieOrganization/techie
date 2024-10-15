package com.techie.backend.user.service;

import com.techie.backend.global.exception.user.InvalidEmailFormatException;
import com.techie.backend.global.exception.user.UserAlreadyExistsException;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;
@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final ModelMapper modelMapper;
    private static final Pattern VALID_EMAIL_ADDRESS_REGEX = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    @Override
    public Boolean register(UserRequest userRequest) {

        if (!VALID_EMAIL_ADDRESS_REGEX.matcher(userRequest.getEmail()).matches()) {
            throw new InvalidEmailFormatException();
        }

        if (userRepository.findByUsername(userRequest.getUsername()).isPresent() ||
                userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        User user = modelMapper.map(userRequest, User.class);
        userRepository.save(user);

        return true;
    }
}