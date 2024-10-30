package com.techie.backend.memo.service;

import com.techie.backend.memo.domain.Memo;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.repository.MemoRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class MemoServiceImpl implements MemoService {
    private final MemoRepository memoRepository;
    private final UserRepository userRepository;
    private final ModelMapper modelMapper;

    @Override
    public ResponseEntity<MemoResponse> createMemo(MemoRequest request, UserDetails userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername())
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));

        Memo memo = modelMapper.map(request, Memo.class);
        memo.assignUser(user);
        memoRepository.save(memo);
        return ResponseEntity.ok(modelMapper.map(memo, MemoResponse.class));
    }

}
