package site.techieloud.backend.memo.service;

import site.techieloud.backend.global.exception.memo.EmptyContentException;
import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.memo.domain.Memo;
import site.techieloud.backend.memo.dto.MemoRequest;
import site.techieloud.backend.memo.dto.MemoResponse;
import site.techieloud.backend.memo.repository.MemoRepository;
import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.user.service.UserService;
import site.techieloud.backend.video.domain.Video;
import site.techieloud.backend.video.dto.VideoResponse;
import site.techieloud.backend.video.repository.VideoRepository;
import site.techieloud.backend.video.service.VideoService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.nio.file.AccessDeniedException;
import java.util.Collections;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class MemoServiceImpl implements MemoService {
    private final MemoRepository memoRepository;
    private final VideoService videoService;
    private final VideoRepository videoRepository;
    private final UserService userService;
    private final ModelMapper modelMapper;

    // -- 메모 생성 --
    @Override
    public ResponseEntity<MemoResponse> createMemo(MemoRequest request, UserDetailsCustom userDetails) {
        if (request.getContent() == null || request.getContent().isBlank()) {
            throw new EmptyContentException();
        }

        Memo memo = modelMapper.map(request, Memo.class);

        // 메모 소유자 할당
        User user = userService.getUserFromSecurityContext(userDetails);
        memo.assignUser(user);

        String videoId = request.getVideoId();
        if (videoId != null){
            Video video = videoRepository.findByVideoId(videoId).orElseGet(()-> {
                        String videoUri = videoService.buildVideoUri(videoId);
                        String videoResponseJson = videoService.getYoutubeResponse(videoUri).getBody();
                        VideoResponse videoResponse = videoService.convertJsonToVideoDTOWithoutPaging(videoResponseJson).get(0);
                        String title = videoResponse.getTitle();
                        return videoRepository.save(Video
                                .builder()
                                .videoId(videoId)
                                .title(title)
                                .build());
                    }
            );
            memo.assignVideo(video);
        }

        memoRepository.save(memo);
        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        return ResponseEntity.ok(memoResponse);
    }

    // --  메모 목록 조회 --
    @Override
    public ResponseEntity<Slice<MemoResponse>> getMemoList(UserDetailsCustom userDetails, Pageable pageable) {
        User user = userService.getUserFromSecurityContext(userDetails);
        Slice<MemoResponse> memoSlice = memoRepository.findByUser(user, pageable)
                                        .map(m -> modelMapper.map(m, MemoResponse.class));

        return ResponseEntity.ok(memoSlice);
    }

    // -- 메모 단건 조회 --
    @Override
    public ResponseEntity<MemoResponse> getMemo(UserDetailsCustom userDetails, Long id) throws AccessDeniedException {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        User user = userService.getUserFromSecurityContext(userDetails);
        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(user)) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        return ResponseEntity.ok(memoResponse);
    }

    // -- 영상 별 메모 조회
    @Override
    public ResponseEntity<Slice<MemoResponse>> getAllMemosByVideoId(UserDetailsCustom userDetails, String videoId, Pageable pageable) {
        User user = userService.getUserFromSecurityContext(userDetails);

        // 조건에 맞는 정보가 없다면 빈 슬라이스 반환
        return ResponseEntity.ok(
                videoRepository.findByVideoId(videoId)
                        .map(video -> memoRepository.findByUserAndVideo(user, video, pageable)
                                .map(memo -> modelMapper.map(memo, MemoResponse.class)))
                        .orElseGet(() -> new SliceImpl<>(Collections.emptyList(), pageable, false))
        );
    }

    // -- 메모 수정 --
    @Override
    public ResponseEntity<MemoResponse> updateMemo(UserDetailsCustom userDetails, Long id, MemoRequest.Update updateRequest) throws AccessDeniedException {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        User user = userService.getUserFromSecurityContext(userDetails);
        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(user)) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        memo.changeTitle(updateRequest.getTitle());
        String content = updateRequest.getContent();
        if (content == null || content.isBlank()) {
            throw new EmptyContentException();
        }
        memo.changeContent(content);
        memoRepository.save(memo);

        MemoResponse memoResponse = modelMapper.map(memo, MemoResponse.class);
        return ResponseEntity.ok(memoResponse);
    }

    // -- 메모 삭제 --
    @Override
    public ResponseEntity<String> deleteMemo(UserDetailsCustom userDetails, Long id) throws AccessDeniedException {
        Memo memo = memoRepository.findById(id)
                .orElseThrow(()->new EntityNotFoundException("메모를 찾을 수 없습니다."));

        User user = userService.getUserFromSecurityContext(userDetails);

        // 현재 사용자와 메모 소유자가 일치하는 지 확인
        if(!memo.getUser().equals(user)) {
            throw new AccessDeniedException("해당 메모에 접근할 권한이 없습니다.");
        }

        memoRepository.deleteById(memo.getId());
        return ResponseEntity.ok("메모가 정상적으로 삭제되었습니다.");
    }
}