package site.techieloud.backend.memo.repository;

import site.techieloud.backend.memo.domain.Memo;
import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.video.domain.Video;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MemoRepository extends JpaRepository<Memo, Long> {
    List<Memo> findByUser(User user);
    Slice<Memo> findByUserAndVideo(User user, Video video, Pageable pageable);
    Slice<Memo> findByUser(User user, Pageable pageable);
}
