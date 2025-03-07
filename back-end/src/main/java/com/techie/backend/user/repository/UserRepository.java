package com.techie.backend.user.repository;

import com.techie.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByEmailAndProvider(String email, String provider);
    Boolean existsByEmail(String email);
    User findByEmail(String email);

}
