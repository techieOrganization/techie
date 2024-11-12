package com.techie.backend.global.exception.user;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class UserNotFoundException extends RuntimeException {
    private final ExceptionType exceptionType;

    public UserNotFoundException() {
        super(ExceptionType.USER_NOT_FOUND.getMessage());
        this.exceptionType = ExceptionType.USER_NOT_FOUND;
    }
}