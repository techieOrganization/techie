package com.techie.backend.user.service;

import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import java.util.regex.Pattern;

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
}