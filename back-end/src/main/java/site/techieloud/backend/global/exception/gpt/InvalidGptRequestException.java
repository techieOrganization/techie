package site.techieloud.backend.global.exception.gpt;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class InvalidGptRequestException extends RuntimeException {
  private final ExceptionType exceptionType;

  public InvalidGptRequestException() {
    super(ExceptionType.INVALID_GPT_REQUEST.getMessage());
    this.exceptionType = ExceptionType.INVALID_GPT_REQUEST;
  }
}
