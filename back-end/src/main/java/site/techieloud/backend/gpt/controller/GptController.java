package site.techieloud.backend.gpt.controller;

import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.gpt.dto.GptRequest;
import site.techieloud.backend.gpt.dto.GptResponse;
import site.techieloud.backend.gpt.service.GptService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "GPT 관리 API", description = "GPT 관련 API 엔드포인트")
@RequestMapping("/api/gpt")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class GptController {
    private final GptService gptService;

    @PostMapping("/qna")
    public ResponseEntity<GptResponse> questionAndAnswer(@AuthenticationPrincipal UserDetailsCustom userDetails, @RequestBody GptRequest gptRequest) {
        return gptService.questionAndAnswer(gptRequest, userDetails);
    }
}