package site.techieloud.backend.memo.controller;

import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.memo.dto.MemoRequest;
import site.techieloud.backend.memo.dto.MemoResponse;
import site.techieloud.backend.memo.service.MemoService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.web.PageableDefault;
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
        return memoService.createMemo(memoRequest, userDetails);
    }

    @GetMapping("/{id}")
    public ResponseEntity<MemoResponse> getMemo(@PathVariable Long id,
                                                @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.getMemo(userDetails, id);
    }

    @GetMapping("/list")
    public ResponseEntity<Slice<MemoResponse>> getAllMemos(@AuthenticationPrincipal UserDetailsCustom userDetails,
                                                           @PageableDefault(size = 10) Pageable pageable) {
        return memoService.getMemoList(userDetails, pageable);
    }

    @GetMapping("/byVideo")
    public ResponseEntity<Slice<MemoResponse>> getAllMemosByVideo(@RequestParam String vId,
                                                                  @AuthenticationPrincipal UserDetailsCustom userDetails,
                                                                  @PageableDefault(size = 10) Pageable pageable) {
        return memoService.getAllMemosByVideoId(userDetails, vId, pageable);
    }

    @PutMapping("/{id}")
    public ResponseEntity<MemoResponse> updateMemo(@PathVariable Long id,
                                                   @RequestBody MemoRequest.Update updateRequest,
                                                   @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.updateMemo(userDetails, id, updateRequest);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteMemo(@PathVariable Long id,
                                             @AuthenticationPrincipal UserDetailsCustom userDetails) throws AccessDeniedException {
        return memoService.deleteMemo(userDetails, id);
    }

}
