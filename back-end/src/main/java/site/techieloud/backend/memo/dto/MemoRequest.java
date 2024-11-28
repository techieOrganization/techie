package site.techieloud.backend.memo.dto;

import lombok.Data;

@Data
public class MemoRequest {
    private String title;
    private String content;
    private String noteTime;
    private String videoId;

    @Data
    public static class Update {
        private String title;
        private String content;
    }
}
