package com.techie.backend.global.exception.user;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class NewPasswordMisMatchException extends RuntimeException {
    private final ExceptionType exceptionType;

    public NewPasswordMisMatchException() {
        super(ExceptionType.NEW_PASSWORD_MISMATCH.getMessage());
        this.exceptionType = ExceptionType.NEW_PASSWORD_MISMATCH;
    }
}
