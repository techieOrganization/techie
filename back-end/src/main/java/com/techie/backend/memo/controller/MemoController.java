package com.techie.backend.memo.controller;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/memo")
public class MemoController {
    private final MemoService memoService;

    @PostMapping
    public ResponseEntity<MemoResponse> createMemo(@RequestBody MemoRequest memoRequest, @AuthenticationPrincipal UserDetailsCustom userDetails) {
        return memoService.createMemo(memoRequest, userDetails.getUsername());
    }

}
