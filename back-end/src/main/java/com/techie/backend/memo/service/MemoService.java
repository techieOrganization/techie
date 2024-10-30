package com.techie.backend.memo.service;

import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;

public interface MemoService {
    public ResponseEntity<MemoResponse> createMemo(MemoRequest memoRequest, UserDetails userDetails);

}
