package com.techie.backend.global.exception.playlist;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class VideoNotFoundException extends RuntimeException {
    private final ExceptionType exceptionType;

    public VideoNotFoundException() {
        super(ExceptionType.VIDEO_NOT_FOUND.getMessage());
        this.exceptionType = ExceptionType.VIDEO_NOT_FOUND;
    }
}