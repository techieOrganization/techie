package com.techie.backend.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionType {
    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    FORBIDDEN_ACTION(HttpStatus.FORBIDDEN, "권한이 없습니다."),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 사용자입니다."),
    INVALID_EMAIL_FORMAT(HttpStatus.BAD_REQUEST, "이메일 형식이 유효하지 않습니다."),
    EMPTY_FIELD(HttpStatus.BAD_REQUEST, "모든 필드를 입력해야 합니다."),
    PASSWORD_TOO_SHORT(HttpStatus.BAD_REQUEST, "비밀번호는 최소 8자리 이상이어야 합니다."),
    PASSWORD_MISMATCH(HttpStatus.BAD_REQUEST, "비밀번호와 비밀번호 확인 값이 일치하지 않습니다."),
    EMPTY_CONTENT(HttpStatus.BAD_REQUEST, "내용이 비어있습니다."),
    PLAYLIST_NOT_FOUND(HttpStatus.NOT_FOUND, "플레이리스트를 찾을 수 없습니다."),
    VIDEO_NOT_FOUND(HttpStatus.NOT_FOUND, "비디오를 찾을 수 없습니다.");
    private final HttpStatus status;
    private final String message;

    ExceptionType(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}