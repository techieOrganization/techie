package com.techie.backend.gpt.controller;

import com.techie.backend.gpt.dto.GptRequest;
import com.techie.backend.gpt.dto.GptResponse;
import com.techie.backend.gpt.service.GptService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/gpt")
@RequiredArgsConstructor
public class GptController {
    private final GptService gptService;

    @PostMapping("/qna")
    public ResponseEntity<GptResponse> questionAndAnswer(@RequestBody GptRequest gptRequest) {
        return gptService.questionAndAnswer(gptRequest);
    }
}