package com.techie.backend.user.repository;

import com.techie.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserRepository extends JpaRepository<User, Long> {

    Boolean existsByEmail(String email);
    User findByEmail(String email);

}
