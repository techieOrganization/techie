package com.techie.backend.global.exception;

import com.techie.backend.global.exception.memo.EmptyContentException;
import com.techie.backend.global.exception.playlist.PlaylistNotFoundException;
import com.techie.backend.global.exception.user.*;
import jakarta.persistence.EntityNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.nio.file.AccessDeniedException;
import java.util.HashMap;
import java.util.Map;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(InvalidEmailFormatException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidEmailFormatException(InvalidEmailFormatException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(EmptyFieldException.class)
    public ResponseEntity<Map<String, Object>> handleEmptyFieldException(EmptyFieldException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(PasswordTooShortException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordTooShortException(PasswordTooShortException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordMismatchException(PasswordMismatchException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(EmptyContentException.class)
    public ResponseEntity<Map<String, Object>> handleEmptyContentException(EmptyContentException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(EntityNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handleEntityNotFoundException(EntityNotFoundException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("status", HttpStatus.NOT_FOUND.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<Map<String, Object>> handleAccessDeniedException(AccessDeniedException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        errorResponse.put("status", HttpStatus.FORBIDDEN.value());
        return new ResponseEntity<>(errorResponse, HttpStatus.FORBIDDEN);
    }

    @ExceptionHandler(PlaylistNotFoundException.class)
    public ResponseEntity<Map<String, Object>> handlePlaylistNotFoundException(PlaylistNotFoundException ex) {
        Map<String, Object> errorResponse = new HashMap<>();
        errorResponse.put("message", ex.getExceptionType().getMessage());
        errorResponse.put("status", ex.getExceptionType().getStatus().value());

        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }
}