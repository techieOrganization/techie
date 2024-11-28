package site.techieloud.backend.global.exception.user;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class EmptyFieldException extends RuntimeException {
    private final ExceptionType exceptionType;

    public EmptyFieldException() {
        super(ExceptionType.EMPTY_FIELD.getMessage());
        this.exceptionType = ExceptionType.EMPTY_FIELD;
    }
}