package com.techie.backend.global.exception;

import com.techie.backend.global.exception.user.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

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
}