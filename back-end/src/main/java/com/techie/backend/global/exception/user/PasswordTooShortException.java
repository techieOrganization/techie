package com.techie.backend.global.exception.user;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class PasswordTooShortException extends RuntimeException {
    private final ExceptionType exceptionType;

    public PasswordTooShortException() {
        super(ExceptionType.PASSWORD_TOO_SHORT.getMessage());
        this.exceptionType = ExceptionType.PASSWORD_TOO_SHORT;
    }
}