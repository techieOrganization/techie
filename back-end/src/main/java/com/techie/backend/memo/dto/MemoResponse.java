package com.techie.backend.memo.dto;

import com.techie.backend.memo.domain.Memo;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class MemoResponse {
    private Long id;
    private String title;
    private String content;
    private String noteTime;
    private String videoId;

    public MemoResponse(Memo memo) {
        this.id = memo.getId();
        this.title = memo.getTitle();
        this.content = memo.getContent();
        this.noteTime = memo.getNoteTime();
        this.videoId = memo.getVideo().getVideoId();
    }
}
