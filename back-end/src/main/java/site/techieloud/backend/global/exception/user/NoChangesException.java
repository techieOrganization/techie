package site.techieloud.backend.global.exception.user;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class NoChangesException extends RuntimeException {

    private final ExceptionType exceptionType;

    public NoChangesException() {
        super(ExceptionType.NO_CHANGES.getMessage());
        this.exceptionType = ExceptionType.NO_CHANGES;
    }
}
