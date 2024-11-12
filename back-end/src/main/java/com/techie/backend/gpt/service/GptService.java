package com.techie.backend.gpt.service;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.gpt.dto.GptRequest;
import com.techie.backend.gpt.dto.GptResponse;
import org.springframework.http.ResponseEntity;

public interface GptService {
    ResponseEntity<GptResponse> questionAndAnswer(GptRequest gptRequest, UserDetailsCustom userDetails);

}
