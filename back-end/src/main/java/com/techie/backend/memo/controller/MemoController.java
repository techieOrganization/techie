package com.techie.backend.memo.controller;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.dto.MemoUpdateRequest;
import com.techie.backend.memo.service.MemoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;
import java.util.List;

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
                                                @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.getMemo(userDetails.getUsername(), id);
    }

    @GetMapping("/list")
    public ResponseEntity<List<MemoResponse>> getAllMemos(@AuthenticationPrincipal UserDetailsCustom userDetails) {
        return memoService.getMemoList(userDetails.getUsername());
    }

    @GetMapping("/byVideo")
    public ResponseEntity<List<MemoResponse>> getAllMemosByVideo(@RequestParam String vId,
                                                                 @AuthenticationPrincipal UserDetailsCustom userDetails) {
        return memoService.getAllMemosByVideoId(userDetails.getUsername(), vId);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemoResponse> updateMemo(@PathVariable Long id,
                                                   @RequestBody MemoUpdateRequest updateRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.updateMemo(userDetails.getUsername(), id, updateRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMemo(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.deleteMemo(userDetails.getUsername(), id);
    }

}
