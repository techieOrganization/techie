package com.techie.backend.global.exception.gpt;

import com.techie.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class GptResponseParseException extends RuntimeException {
  private final ExceptionType exceptionType;

  public GptResponseParseException() {
    super(ExceptionType.GPT_RESPONSE_PARSE_FAILED.getMessage());
    this.exceptionType = ExceptionType.GPT_RESPONSE_PARSE_FAILED;
  }
}