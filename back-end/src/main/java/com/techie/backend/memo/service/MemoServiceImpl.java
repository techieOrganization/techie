package com.techie.backend.memo.service;

import com.techie.backend.memo.domain.Memo;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.repository.MemoRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemoServiceImpl implements MemoService {
    private final MemoRepository memoRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ResponseEntity<MemoResponse> createMemo(MemoRequest request, String username) {
        User user = userRepository.findByEmail(username);
        Memo memo = modelMapper.map(request, Memo.class);
        memo.assignUser(user);
        memoRepository.save(memo);
        return ResponseEntity.ok(modelMapper.map(memo, MemoResponse.class));
    }

    @Override
    public ResponseEntity<List<MemoResponse>> getMemoList(Long id, String username) {
        User user = userRepository.findByEmail(username);
        Optional<List<Memo>> memoList = memoRepository.findByUser(user);
        List<MemoResponse> memoResponses = new ArrayList<>();
        if(memoList.isPresent()) {
            for(Memo memo : memoList.get()) {
                memoResponses.add(modelMapper.map(memo, MemoResponse.class));
            }
            return ResponseEntity.ok(memoResponses); // 수정
        }

        return ResponseEntity.ok(new ArrayList<>()); // 수정

    }

    @Override
    public ResponseEntity<MemoResponse> getMemo(Long id) {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(() -> new IllegalArgumentException("해당 메모가 없습니다."));
        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        return ResponseEntity.ok(memoResponse);
    }

}
