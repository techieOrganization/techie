package com.techie.backend.memo.controller;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.nio.file.AccessDeniedException;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/memo")
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
    public ResponseEntity<Slice<MemoResponse>> getAllMemos(@AuthenticationPrincipal UserDetailsCustom userDetails,
                                                          Pageable pageable) {
        return memoService.getMemoList(userDetails.getUsername(), pageable);
    }

    @GetMapping("/byVideo")
    public ResponseEntity<Slice<MemoResponse>> getAllMemosByVideo(@RequestParam String vId,
                                                                  @AuthenticationPrincipal UserDetailsCustom userDetails,
                                                                  Pageable pageable) {
        return memoService.getAllMemosByVideoId(userDetails.getUsername(), vId, pageable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemoResponse> updateMemo(@PathVariable Long id,
                                                   @RequestBody MemoRequest.Update updateRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.updateMemo(userDetails.getUsername(), id, updateRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMemo(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.deleteMemo(userDetails.getUsername(), id);
    }

}
