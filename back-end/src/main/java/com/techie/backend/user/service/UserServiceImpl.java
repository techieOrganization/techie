package com.techie.backend.user.service;

import com.techie.backend.global.exception.user.InvalidEmailFormatException;
import com.techie.backend.global.exception.user.UserAlreadyExistsException;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
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
    public Boolean register(UserRequest.Register userRequest) {

        if (!VALID_EMAIL_ADDRESS_REGEX.matcher(userRequest.getEmail()).matches()) {
            throw new InvalidEmailFormatException();
        }

        if (userRepository.findByUsername(userRequest.getEmail()).isPresent() ||
                userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        userRequest.setPassword(passwordEncoder.encode(userRequest.getPassword()));

        User user = modelMapper.map(userRequest, User.class);
        userRepository.save(user);

        return true;
    }

    @Override
    public UserResponse.Information getLoggedInUser(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        return modelMapper.map(user, UserResponse.Information.class);
    }

    @Override
    public Boolean updateUser(UserDetails userDetails, UserRequest.Update updateUserRequest) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));

        if (updateUserRequest.getNickname() != null) {
            user.setNickname(updateUserRequest.getNickname());
        }
        if (updateUserRequest.getEmail() != null && VALID_EMAIL_ADDRESS_REGEX.matcher(updateUserRequest.getEmail()).matches()) {
            user.setEmail(updateUserRequest.getEmail());
        } else if (updateUserRequest.getEmail() != null) {
            throw new InvalidEmailFormatException();
        }
        if (updateUserRequest.getCurrentPassword() != null && updateUserRequest.getNewPassword() != null) {
            if (!passwordEncoder.matches(updateUserRequest.getCurrentPassword(), user.getPassword())) {
                throw new IllegalArgumentException("Current password does not match password");
            }
            user.setPassword(passwordEncoder.encode(updateUserRequest.getCurrentPassword()));
        }
        userRepository.save(user);
        return true;
    }

    @Override
    public Boolean deleteUser(UserDetails userDetails) {
        String email = userDetails.getUsername();
        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
        userRepository.delete(user);
        return true;
    }

}