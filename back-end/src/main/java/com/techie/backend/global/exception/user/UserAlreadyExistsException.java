package com.techie.backend.global.exception.user;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class UserAlreadyExistsException extends RuntimeException {

    private final ExceptionType exceptionType;

    public UserAlreadyExistsException() {
        super(ExceptionType.USER_ALREADY_EXISTS.getMessage());  // 올바른 메시지 사용
        this.exceptionType = ExceptionType.USER_ALREADY_EXISTS;  // 올바른 예외 타입 사용
    }
}
