package com.techie.backend.user.service;

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

    @Override
    public Boolean joinProcess(UserRequest.Register request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String nickname = request.getNickname();

        Boolean iseExist = userRepository.existsByEmail(email);

        if (iseExist) {

            return false;

        } else {

            User data = User.builder()
                    .email(email)
                    .password(bCryptPasswordEncoder.encode(password))
                    .nickname(nickname)
                    .role("ROLE_ADMIN")
                    .build();
            userRepository.save(data);

            return true;
        }
    }

    @Override
    public UserResponse.Information getUser(UserDetailsCustom userDetails) {
        String email = userDetails.getUsername();
        String nickname = userDetails.getNickname();

        return new UserResponse.Information(email, nickname);
    }

    @Override
    public Boolean updateUser(UserDetailsCustom userDetails, UserRequest.Update request) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user == null) {
            return false;
        }
        if (request.getNewPassword() == null || request.getNewPassword().equals(user.getPassword())) {
            return false;
        }

        String updatedNickname = request.getNickname() != null ? request.getNickname() : user.getNickname();
        String updatedPassword = bCryptPasswordEncoder.encode(request.getNewPassword());
        User updatedUser = user.toBuilder()
                .nickname(updatedNickname)
                .password(updatedPassword)
                .build();
        userRepository.save(updatedUser);

        return true;
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