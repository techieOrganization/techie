package site.techieloud.backend.memo.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class MemoResponse {
    private Long id;
    private String title;
    private String content;
    private String noteTime;
    private String videoId;
}
