package site.techieloud.backend.global.exception.user;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class InvalidEmailFormatException extends RuntimeException {
    private final ExceptionType exceptionType;

    public InvalidEmailFormatException() {
        super(ExceptionType.INVALID_EMAIL_FORMAT.getMessage());
        this.exceptionType = ExceptionType.INVALID_EMAIL_FORMAT;
    }
}