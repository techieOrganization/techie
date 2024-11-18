package com.techie.backend.user.service;

import com.techie.backend.global.exception.user.*;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;

    public User getUserFromSecurityContext(UserDetailsCustom userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new UserNotFoundException();
        }
        return user;
    }

    @Override
    public Boolean joinProcess(UserRequest.Register request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String confirmPassword = request.getConfirmPassword();
        String nickname = request.getNickname();

        if (!email.matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            throw new InvalidEmailFormatException();
        }
        if (password.length() < 8) {
            throw new PasswordTooShortException();
        }
        if (!password.equals(confirmPassword)) {
            throw new PasswordMismatchException();
        }
        Boolean isExist = userRepository.existsByEmail(email);
        if (isExist) {
            throw new UserAlreadyExistsException();
        } else {
            User data = User.builder()
                    .email(email)
                    .password(bCryptPasswordEncoder.encode(password))
                    .nickname(nickname)
                    .role("ROLE_USER")
                    .build();
            userRepository.save(data);

            return true;
        }
    }

    @Override
    public UserResponse.Information getUser(UserDetailsCustom userDetails) {
        User user = getUserFromSecurityContext(userDetails);
        return new UserResponse.Information(user.getEmail(), user.getNickname());
    }

    @Override
    public Boolean updateUser(UserDetailsCustom userDetails, UserRequest.Update request) {
        try {
            if (isRequestEmpty(request)) {
                throw new NoChangesException();
            }

            User user = getUserFromSecurityContext(userDetails);
            boolean isUpdated = false;

            if (request.getNickname() != null && !request.getNickname().isEmpty() &&
                    !request.getNickname().equals(user.getNickname())) {
                user = user.toBuilder()
                        .nickname(request.getNickname())
                        .build();
                isUpdated = true;
            }

            if (request.getNewPassword() != null && !request.getNewPassword().isEmpty() &&
                    !bCryptPasswordEncoder.matches(request.getNewPassword(), user.getPassword())) {
                String encodedPassword = bCryptPasswordEncoder.encode(request.getNewPassword());
                user = user.toBuilder()
                        .password(encodedPassword)
                        .build();
                isUpdated = true;
            }

            if (isUpdated) {
                userRepository.save(user);
                return true;
            }

            throw new NoChangesException();

        } catch (UserNotFoundException e) {
            throw new NoChangesException();
        }
    }

    private boolean isRequestEmpty(UserRequest.Update request) {
        return (request.getNickname() == null || request.getNickname().isEmpty()) &&
                (request.getNewPassword() == null || request.getNewPassword().isEmpty());
    }

    @Override
    public Boolean deleteUser(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }
        userRepository.delete(user);

        return true;
    }
}