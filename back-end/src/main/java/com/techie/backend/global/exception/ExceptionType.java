package com.techie.backend.global.exception;

import lombok.Getter;
import org.springframework.http.HttpStatus;

@Getter
public enum ExceptionType {

    USER_NOT_FOUND(HttpStatus.NOT_FOUND, "사용자가 존재하지 않습니다."),
    INVALID_TOKEN(HttpStatus.UNAUTHORIZED, "유효하지 않은 토큰입니다."),
    FORBIDDEN_ACTION(HttpStatus.FORBIDDEN, "권한이 없습니다."),
    USER_ALREADY_EXISTS(HttpStatus.CONFLICT, "이미 존재하는 사용자입니다."),
    INVALID_EMAIL_FORMAT(HttpStatus.BAD_REQUEST, "이메일 형식이 유효하지 않습니다.");  // 추가된 항목

    private final HttpStatus status;
    private final String message;

    ExceptionType(HttpStatus status, String message) {
        this.status = status;
        this.message = message;
    }
}
