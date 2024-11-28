package site.techieloud.backend.global.exception.gpt;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class GptRequestException extends RuntimeException {
  private final ExceptionType exceptionType;

  public GptRequestException() {
    super(ExceptionType.GPT_REQUEST_FAILED.getMessage());
    this.exceptionType = ExceptionType.GPT_REQUEST_FAILED;
  }
}