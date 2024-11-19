package com.techie.backend.memo.service;

import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;

import java.nio.file.AccessDeniedException;

public interface MemoService {
    public ResponseEntity<MemoResponse> createMemo(MemoRequest memoRequest, String username);
    public ResponseEntity<Slice<MemoResponse>> getMemoList(String username, Pageable pageable);
    public ResponseEntity<MemoResponse> getMemo(String username, Long id) throws AccessDeniedException;

    ResponseEntity<Slice<MemoResponse>> getAllMemosByVideoId(String username, String videoId, Pageable pageable);
    public ResponseEntity<MemoResponse> updateMemo(String username, Long id, MemoRequest.Update updateRequest) throws AccessDeniedException;
    public ResponseEntity<String> deleteMemo(String username, Long id) throws AccessDeniedException;
}
