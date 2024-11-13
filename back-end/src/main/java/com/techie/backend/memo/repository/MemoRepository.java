package com.techie.backend.memo.repository;

import com.techie.backend.memo.domain.Memo;
import com.techie.backend.user.domain.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface MemoRepository extends JpaRepository<Memo, Long> {
    List<Memo> findByUser(User user);
}
