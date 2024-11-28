package site.techieloud.backend.gpt.service;

import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.gpt.dto.GptRequest;
import site.techieloud.backend.gpt.dto.GptResponse;
import org.springframework.http.ResponseEntity;

public interface GptService {
    ResponseEntity<GptResponse> questionAndAnswer(GptRequest gptRequest, UserDetailsCustom userDetails);

}
