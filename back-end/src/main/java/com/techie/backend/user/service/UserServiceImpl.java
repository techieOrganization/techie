package com.techie.backend.user.service;

import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.repository.UserRepository;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.regex.Pattern;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final BCryptPasswordEncoder bCryptPasswordEncoder;
    private static final Pattern VALID_EMAIL_ADDRESS_REGEX = Pattern.compile(
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,6}$"
    );

    public UserServiceImpl(UserRepository userRepository, BCryptPasswordEncoder bCryptPasswordEncoder) {
        this.userRepository = userRepository;
        this.bCryptPasswordEncoder = bCryptPasswordEncoder;
    }

    @Override
    public Boolean joinProcess(UserRequest.Register request) {
        String email = request.getEmail();
        String password = request.getPassword();
        String nickname = request.getNickname();

        Boolean iseExist = userRepository.existsByEmail(email);

        if (iseExist) {
            return false;
        } else {
            User data = new User();
            data.setEmail(email);
            data.setPassword(bCryptPasswordEncoder.encode(password));
            data.setNickname(nickname);
            data.setRole("ROLE_ADMIN");

            userRepository.save(data);

            return true;
        }
    }

//        // 저장된 User 엔티티를 UserResponse.Information DTO로 변환하여 반환
//        return UserResponse.Information.builder()
//                .email(user.getEmail())
//                .nickname(user.getNickname())
//                .createdDate(user.getCreatedDate())
//                .modifiedDate(user.getModifiedDate())
//                .build();
//    }
//
//    @Override
//    public UserResponse.Information getLoggedInUser(UserDetails userDetails) {
//        String email = userDetails.getUsername();
//        User user = userRepository.findByEmail(email)
//                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        return modelMapper.map(user, UserResponse.Information.class);
//    }
//
//    @Override
//    public Boolean updateUser(UserDetails userDetails, UserRequest.Update updateUserRequest) {
//        String email = userDetails.getUsername();
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//
//        String newEmail = updateUserRequest.getEmail() != null && VALID_EMAIL_ADDRESS_REGEX.matcher(updateUserRequest.getEmail()).matches()
//                ? updateUserRequest.getEmail() : user.getEmail();
//
//        String newNickname = updateUserRequest.getNickname() != null ? updateUserRequest.getNickname() : user.getNickname();
//
//        String newPassword = user.getPassword();
//        if (updateUserRequest.getCurrentPassword() != null && updateUserRequest.getNewPassword() != null) {
//            if (!passwordEncoder.matches(updateUserRequest.getCurrentPassword(), user.getPassword())) {
//                throw new IllegalArgumentException("Current password does not match password");
//            }
//            newPassword = passwordEncoder.encode(updateUserRequest.getNewPassword());
//        }
//
//        User updatedUser = User.builder()
//                .email(newEmail)
//                .password(newPassword)
//                .nickname(newNickname)
//                .createdDate(user.getCreatedDate()) // 기존 생성일 유지
//                .modifiedDate(LocalDateTime.now())  // 수정일 갱신
//                .build();
//
//        userRepository.save(updatedUser);
//        return true;
//    }
//
//    @Override
//    public Boolean deleteUser(UserDetails userDetails) {
//        String email = userDetails.getUsername();
//        User user = userRepository.findByEmail(email).orElseThrow(() -> new UsernameNotFoundException("User not found"));
//        userRepository.delete(user);
//        return true;
//    }
}
