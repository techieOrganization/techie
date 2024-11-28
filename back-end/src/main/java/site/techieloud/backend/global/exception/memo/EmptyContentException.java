package site.techieloud.backend.global.exception.memo;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class EmptyContentException extends RuntimeException {
    private final ExceptionType exceptionType;

    public EmptyContentException() {
        super(ExceptionType.EMPTY_CONTENT.getMessage());
        this.exceptionType = ExceptionType.EMPTY_CONTENT;
    }
}
