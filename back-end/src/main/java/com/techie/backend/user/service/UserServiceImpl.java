package com.techie.backend.user.service;

import com.techie.backend.global.security.JWTUtil;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private final JWTUtil jwtUtil;
    private final UserDetailsService userDetailsService;


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
    public Boolean updateUser(String email, UserRequest.Update request) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            return false;
        }
        User updatedUser = User.builder()
                .id(user.getId())
                .email(user.getEmail())
                .nickname(request.getNickname() != null ? request.getNickname() : user.getNickname())
                .password(request.getNewPassword() != null ? bCryptPasswordEncoder.encode(request.getNewPassword()) : user.getPassword())
                .role(user.getRole())
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