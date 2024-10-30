package com.techie.backend.memo.service;

import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.repository.MemoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {
    private final MemoRepository memoRepository;

    @Override
    public ResponseEntity<MemoResponse> createMemo(MemoRequest request, UserDetails userDetails) {

        return null;
    }


}
