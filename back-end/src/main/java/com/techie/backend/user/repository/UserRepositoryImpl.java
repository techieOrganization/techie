package com.techie.backend.user.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@RequiredArgsConstructor
@Repository
public class UserRepositoryImpl implements UserRepositoryCustom {

    private final JPAQueryFactory queryFactory;

//    @Override
//    public Optional<User> findByUsername(String username) {
//        QUser user = QUser.user;
//        User foundUser = queryFactory
//                .selectFrom(user)
//                .where(user.email.eq(username))
//                .fetchOne();
//        return Optional.ofNullable(foundUser);
//    }
//
//    @Override
//    public Optional<User> findByEmail(String email) {
//        return Optional.empty();
//    }
}
