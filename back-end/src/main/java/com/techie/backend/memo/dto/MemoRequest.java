package com.techie.backend.memo.dto;

import lombok.Data;

@Data
public class MemoRequest {
    private String title;
    private String content;
    private String noteTime;
    private String videoId;
}
