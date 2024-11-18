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
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.NoSuchElementException;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemoServiceImpl implements MemoService {
    private final MemoRepository memoRepository;
    private final UserRepository userRepository;
    private final VideoRepository videoRepository;
    private final ModelMapper modelMapper;

    // -- 메모 생성 --
    @Override
    public ResponseEntity<MemoResponse> createMemo(MemoRequest request, String username) {
        if (request.getContent() == null || request.getContent().isBlank()) {
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
        return ResponseEntity.ok(memoResponse);
    }

    // --  메모 목록 조회 --
    @Override
    public ResponseEntity<Slice<MemoResponse>> getMemoList(String username, Pageable pageable) {
        User user = userRepository.findByEmail(username);
        Slice<MemoResponse> memoSlice = memoRepository.findByUser(user, pageable).map(m -> MemoResponse.MemoToResponse(m, m.getVideo()));

        // 현재 사용자가 작성한 메모가 없을 경우
        if(memoSlice.isEmpty()) {
            throw new EntityNotFoundException("현재 사용자가 작성한 메모가 없거나 모두 표시했습니다.");
        }
        return ResponseEntity.ok(memoSlice);
    }

    // -- 메모 단건 조회 --
    @Override
    public ResponseEntity<MemoResponse> getMemo(String username, Long id) throws AccessDeniedException {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(userRepository.findByEmail(username))) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        return ResponseEntity.ok(memoResponse);
    }

    // -- 영상 별 메모 조회
    @Override
    public ResponseEntity<Slice<MemoResponse>> getAllMemosByVideoId(String username, String videoId, Pageable pageable) {
        User user = userRepository.findByEmail(username);
        Video video = videoRepository.findByVideoId(videoId)
                .orElseThrow(() -> new EntityNotFoundException("해당 영상이 없습니다."));

        Slice<MemoResponse> memoSlice = memoRepository.findByUserAndVideo(user, video, pageable)
                                                        .map(m -> MemoResponse.MemoToResponse(m, m.getVideo()));
        if (memoSlice.isEmpty()) {
            throw new EntityNotFoundException("해당 영상에 작성한 메모가 없거나 모두 표시했습니다.");
        }
        return ResponseEntity.ok(memoSlice);
    }

    // -- 메모 수정 --
    @Override
    public ResponseEntity<MemoResponse> updateMemo(String username, Long id, MemoRequest.Update updateRequest) throws AccessDeniedException {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(userRepository.findByEmail(username))) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        memo.changeTitle(updateRequest.getTitle());
        String content = updateRequest.getContent();
        if (content == null || content.isBlank()) {
            throw new EmptyContentException();
        }
        memo.changeContent(updateRequest.getContent());
        memoRepository.save(memo);

        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        return ResponseEntity.ok(memoResponse);
    }

    // -- 메모 삭제 --
    @Override
    public ResponseEntity<String> deleteMemo(String username, Long id) throws AccessDeniedException {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(userRepository.findByEmail(username))) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        memoRepository.deleteById(memo.getId());
        return ResponseEntity.ok("메모가 정상적으로 삭제되었습니다.");
    }


}
