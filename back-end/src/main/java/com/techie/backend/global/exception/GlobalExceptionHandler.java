package com.techie.backend.global.exception;

import com.techie.backend.global.exception.memo.EmptyContentException;
import com.techie.backend.global.exception.user.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;
import java.util.NoSuchElementException;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getExceptionType().getMessage());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<Map<String, String>> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidEmailFormatException.class)
    public ResponseEntity<Map<String, String>> handleInvalidEmailFormatException(InvalidEmailFormatException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getExceptionType().getMessage());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(EmptyFieldException.class)
    public ResponseEntity<Map<String, String>> handleEmptyFieldException(EmptyFieldException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getExceptionType().getMessage());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(PasswordTooShortException.class)
    public ResponseEntity<Map<String, String>> handlePasswordTooShortException(PasswordTooShortException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getExceptionType().getMessage());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<Map<String, String>> handlePasswordMismatchException(PasswordMismatchException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(EmptyContentException.class)
    public ResponseEntity<Map<String, String>> handleEmptyContentException(EmptyContentException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(NoSuchElementException.class)
    public ResponseEntity<Map<String, String>> handleNoSuchElementException(NoSuchElementException ex) {
        Map<String, String> errorResponse = new HashMap<>();
        errorResponse.put("error", ex.getMessage());
        return new ResponseEntity<>(errorResponse, HttpStatus.NOT_FOUND);
    }

}