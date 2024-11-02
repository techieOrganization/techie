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

import java.time.LocalDateTime;
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
    public UserResponse.Information register(UserRequest.Register userRequest) {

        if (!VALID_EMAIL_ADDRESS_REGEX.matcher(userRequest.getEmail()).matches()) {
            throw new InvalidEmailFormatException();
        }

        if (userRepository.findByEmail(userRequest.getEmail()).isPresent()) {
            throw new UserAlreadyExistsException();
        }

        User user = User.builder()
                .email(userRequest.getEmail())
                .password(passwordEncoder.encode(userRequest.getPassword()))
                .nickname(userRequest.getNickname())
                .build();

        userRepository.save(user);

        // 저장된 User 엔티티를 UserResponse.Information DTO로 변환하여 반환
        return UserResponse.Information.builder()
                .email(user.getEmail())
                .nickname(user.getNickname())
                .createdDate(user.getCreatedDate())
                .modifiedDate(user.getModifiedDate())
                .build();
    }

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
