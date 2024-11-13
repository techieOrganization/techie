package com.techie.backend.memo.service;

import com.techie.backend.global.exception.memo.EmptyContentException;
import com.techie.backend.memo.domain.Memo;
import com.techie.backend.memo.dto.MemoRequest;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.memo.repository.MemoRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.repository.UserRepository;
import com.techie.backend.video.domain.Video;
import com.techie.backend.video.repository.VideoRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.ArrayList;
import java.util.List;
import java.util.NoSuchElementException;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Slf4j
public class MemoServiceImpl implements MemoService {
    private final MemoRepository memoRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final ModelMapper modelMapper;

    @Override
    public ResponseEntity<MemoResponse> createMemo(MemoRequest request, String username) {
        if (request.getContent() == null || request.getContent().trim().isEmpty()) {
            throw new EmptyContentException();
        }

        Memo memo = modelMapper.map(request, Memo.class);

        // 메모 소유자 할당
        User user = userRepository.findByEmail(username);
        memo.assignUser(user);

        // 메모 연관 동영상 할당
        if (request.getVideoId() != null) {
            Video video = videoRepository.findByVideoId(request.getVideoId())
                    .orElseThrow(() -> new NoSuchElementException("해당 영상을 찾을 수 없습니다."));
            memo.assignVideo(video);
        }

        memoRepository.save(memo);
        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        memoResponse.setVideoId(memo.getVideo().getVideoId());
        return ResponseEntity.ok(memoResponse);
    }
//                .orElseThrow(() -> new EntityNotFoundException("해당 유저의 메모가 없습니다."));
    @Override
    public ResponseEntity<List<MemoResponse>> getMemoList(String username) {
        User user = userRepository.findByEmail(username);
        List<Memo> memoList = memoRepository.findByUser(user)
                .orElseThrow(() -> new EntityNotFoundException("해당 유저의 메모가 없습니다."));

        //Optional[[]]
        List<MemoResponse> memoResponses = memoList.stream()
                                                .map(memo -> modelMapper.map(memo, MemoResponse.class))
                                                .toList();

        return ResponseEntity.ok(memoResponses); // 수정
    }

    @Override
    public ResponseEntity<MemoResponse> getMemo(String username, Long id) throws AccessDeniedException {
        log.info("유저 이메일: {}", username);

        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(userRepository.findByEmail(username))) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        memoResponse.setVideoId(memo.getVideo().getVideoId());
        return ResponseEntity.ok(memoResponse);
    }

}
