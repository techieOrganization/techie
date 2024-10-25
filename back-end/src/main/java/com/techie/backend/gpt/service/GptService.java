package com.techie.backend.gpt.service;

import com.techie.backend.gpt.dto.GptRequest;
import com.techie.backend.gpt.dto.GptResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

public interface GptService {
    ResponseEntity<GptResponse> questionAndAnswer(GptRequest gptRequest);
}
