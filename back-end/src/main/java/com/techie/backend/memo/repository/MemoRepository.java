package com.techie.backend.memo.repository;

import com.techie.backend.memo.domain.Memo;
import org.springframework.data.jpa.repository.JpaRepository;

public interface MemoRepository extends JpaRepository<Memo, Long> {
}
