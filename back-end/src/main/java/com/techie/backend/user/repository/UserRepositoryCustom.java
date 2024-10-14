package com.techie.backend.user.repository;

import com.techie.backend.user.User;

import java.util.Optional;


public interface UserRepositoryCustom {

    Optional<User> findByUsername(String username);
    Optional<User> findByEmail(String email);

}
