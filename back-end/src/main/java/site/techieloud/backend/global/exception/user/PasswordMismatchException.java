package site.techieloud.backend.global.exception.user;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class PasswordMismatchException extends RuntimeException {
    private final ExceptionType exceptionType;

    public PasswordMismatchException() {
        super(ExceptionType.PASSWORD_MISMATCH.getMessage());
        this.exceptionType = ExceptionType.PASSWORD_MISMATCH;
    }
}