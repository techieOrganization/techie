package com.techie.backend.global.exception;

import com.techie.backend.global.exception.user.InvalidEmailFormatException;
import com.techie.backend.global.exception.user.UserAlreadyExistsException;
import com.techie.backend.global.exception.user.UserNotFoundException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@Slf4j
@RestControllerAdvice
public class GlobalExceptionHandler {

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<String> handleUserNotFoundException(UserNotFoundException ex) {
        return new ResponseEntity<>(ex.getExceptionType().getMessage(), ex.getExceptionType().getStatus());
    }

    @ExceptionHandler(UserAlreadyExistsException.class)
    public ResponseEntity<String> handleUserAlreadyExistsException(UserAlreadyExistsException ex) {
        return new ResponseEntity<>(ex.getMessage(), HttpStatus.CONFLICT);
    }

    @ExceptionHandler(InvalidEmailFormatException.class)
    public ResponseEntity<String> handleInvalidEmailFormatException(InvalidEmailFormatException ex) {
        return new ResponseEntity<>(ex.getExceptionType().getMessage(), ex.getExceptionType().getStatus());
    }
}
