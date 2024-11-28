package site.techieloud.backend.global.exception.gpt;

import site.techieloud.backend.global.exception.ExceptionType;
import lombok.Getter;

@Getter
public class GptResponseParseException extends RuntimeException {
  private final ExceptionType exceptionType;

  public GptResponseParseException() {
    super(ExceptionType.GPT_RESPONSE_PARSE_FAILED.getMessage());
    this.exceptionType = ExceptionType.GPT_RESPONSE_PARSE_FAILED;
  }
}