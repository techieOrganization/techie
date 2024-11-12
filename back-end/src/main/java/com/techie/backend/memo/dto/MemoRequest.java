package com.techie.backend.memo.dto;

import com.techie.backend.memo.domain.Memo;
import lombok.Data;

@Data
public class MemoRequest {
    private String title;
    private String content;
    private String noteTime;
    private String videoId;
}
