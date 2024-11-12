package com.techie.backend.memo.dto;

import lombok.Data;

@Data
public class MemoResponse {
    private String title;
    private String content;
    private String noteTime;
    private String videoId;
}
