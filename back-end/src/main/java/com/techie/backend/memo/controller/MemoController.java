package com.techie.backend.memo.controller;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.service.MemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

@Controller
@RequiredArgsConstructor
@RequestMapping("/api/memo")
@Slf4j
public class MemoController {
    private final MemoService memoService;

    @PostMapping
    public ResponseEntity<MemoResponse> createMemo(@RequestBody MemoRequest memoRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) {
        return memoService.createMemo(memoRequest, userDetails.getUsername());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemoResponse> getMemo(@PathVariable Long id,
                                                @AuthenticationPrincipal UserDetailsCustom userDetails) {
        return memoService.getMemo(userDetails.getUsername(), id);
    }

}
