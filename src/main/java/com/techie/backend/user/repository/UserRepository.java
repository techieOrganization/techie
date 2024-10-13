package com.techie.backend.user.repository;

import com.techie.backend.user.entity.User;
import com.techie.backend.user.repository.custom.UserRepositoryCustom;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long>, UserRepositoryCustom {

    Optional<User> findByNickname(String nickname);
}
