package site.techieloud.backend.memo.service;

import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.memo.dto.MemoRequest;
import site.techieloud.backend.memo.dto.MemoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;

import java.nio.file.AccessDeniedException;

public interface MemoService {
    public ResponseEntity<MemoResponse> createMemo(MemoRequest memoRequest, UserDetailsCustom userDetails);
    public ResponseEntity<Slice<MemoResponse>> getMemoList(UserDetailsCustom userDetails, Pageable pageable);
    public ResponseEntity<MemoResponse> getMemo(UserDetailsCustom userDetails, Long id) throws AccessDeniedException;

    public ResponseEntity<Slice<MemoResponse>> getAllMemosByVideoId(UserDetailsCustom userDetails, String videoId, Pageable pageable);
    public ResponseEntity<MemoResponse> updateMemo(UserDetailsCustom userDetails, Long id, MemoRequest.Update updateRequest) throws AccessDeniedException;
    public ResponseEntity<String> deleteMemo(UserDetailsCustom userDetails, Long id) throws AccessDeniedException;
}
