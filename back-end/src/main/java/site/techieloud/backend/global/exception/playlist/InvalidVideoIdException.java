package site.techieloud.backend.global.exception.playlist;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class InvalidVideoIdException extends RuntimeException {
    private final ExceptionType exceptionType;

    public InvalidVideoIdException() {
        super(ExceptionType.INVALID_VIDEO_ID.getMessage());
        this.exceptionType = ExceptionType.INVALID_VIDEO_ID;
    }
}
