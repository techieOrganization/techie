package com.techie.backend.global.exception.playlist;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class PlaylistNotFoundException extends RuntimeException {
    private final ExceptionType exceptionType;

    public PlaylistNotFoundException() {
        super(ExceptionType.PLAYLIST_NOT_FOUND.getMessage());
        this.exceptionType = ExceptionType.PLAYLIST_NOT_FOUND;
    }
}