package site.techieloud.backend.user.service;

import site.techieloud.backend.global.exception.user.*;
import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.user.dto.UserRequest;
import site.techieloud.backend.user.dto.UserResponse;
import site.techieloud.backend.user.repository.UserRepository;
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
        User user = getUserFromSecurityContext(userDetails);

        String newNickname = request.getNickname();
        String oldPassword = request.getOldPassword();
        String newPassword = request.getNewPassword();

        if (isRequestEmpty(request)) {
            throw new NoChangesException();
        }

        boolean isUpdated = false;

        if (newNickname != null && !newNickname.isEmpty() && !newNickname.equals(user.getNickname())) {
            user = user.toBuilder()
                    .nickname(newNickname)
                    .build();
            isUpdated = true;
        }

        if (newPassword != null && !newPassword.isEmpty()) {
            if (oldPassword == null || !bCryptPasswordEncoder.matches(oldPassword, user.getPassword())) {
                throw new InvalidOldPasswordException();
            }

            if (bCryptPasswordEncoder.matches(newPassword, user.getPassword())) {
                throw new NewPasswordMisMatchException();
            }
            if (newPassword.length() < 8 || !isPasswordValid(newPassword)) {
                throw new PasswordTooShortException();
            }
            user = user.toBuilder()
                    .password(bCryptPasswordEncoder.encode(newPassword))
                    .build();
            isUpdated = true;
        }
        if (isUpdated) {
            userRepository.save(user);
            return true;
        }
        throw new NoChangesException();
    }

    private boolean isPasswordValid(String password) {
        String passwordRegex = "^(?=.*[0-9]).{8,}$";
        return password.matches(passwordRegex);
    }

    private boolean isRequestEmpty(UserRequest.Update request) {
        return (request.getNickname() == null || request.getNickname().isEmpty()) &&
                (request.getNewPassword() == null || request.getNewPassword().isEmpty());
    }

    @Override
    public Boolean deleteUser(UserDetailsCustom userDetails, UserRequest.Delete request) {
        User user = getUserFromSecurityContext(userDetails);
        if (!bCryptPasswordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidPasswordException();
        }
        userRepository.delete(user);
        return true;
    }
}