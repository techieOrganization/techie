package com.techie.backend.global.exception.memo;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class EmptyContentException extends RuntimeException {
    private final ExceptionType exceptionType;

    public EmptyContentException() {
        super(ExceptionType.EMPTY_CONTENT.getMessage());
        this.exceptionType = ExceptionType.EMPTY_CONTENT;
    }
}
