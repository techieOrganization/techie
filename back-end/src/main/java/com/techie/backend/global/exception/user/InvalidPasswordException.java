package com.techie.backend.global.exception.user;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class InvalidPasswordException extends RuntimeException {
    private final ExceptionType exceptionType;

    public InvalidPasswordException() {
        super(ExceptionType.INVALID_PASSWORD.getMessage());
        this.exceptionType = ExceptionType.INVALID_PASSWORD;
    }
}
