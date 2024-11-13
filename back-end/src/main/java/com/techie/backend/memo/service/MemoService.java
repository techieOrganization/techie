package com.techie.backend.memo.service;

import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.dto.MemoUpdateRequest;
import org.springframework.http.ResponseEntity;

import java.nio.file.AccessDeniedException;
import java.util.List;

public interface MemoService {
    public ResponseEntity<MemoResponse> createMemo(MemoRequest memoRequest, String username);
    public ResponseEntity<List<MemoResponse>> getMemoList(String username);
    public ResponseEntity<MemoResponse> getMemo(String username, Long id) throws AccessDeniedException;
    public ResponseEntity<MemoResponse> updateMemo(String username, Long id, MemoUpdateRequest updateRequest) throws AccessDeniedException;
}
