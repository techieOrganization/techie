package site.techieloud.backend.global.security;

import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;


@Service
@RequiredArgsConstructor
public class UserDetailsServiceCustom implements UserDetailsService {
    private final UserRepository userRepository;

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User userData = userRepository.findByEmail(email);

        if (userData == null) {
            throw new UsernameNotFoundException("User not found: " + email);
        } else {
            return new UserDetailsCustom(userData);
        }
    }
}