package site.techieloud.backend.gpt.repository;

import site.techieloud.backend.gpt.domain.Gpt;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface GptRepository extends JpaRepository<Gpt, Long>, GptRepositoryCustom {
}
