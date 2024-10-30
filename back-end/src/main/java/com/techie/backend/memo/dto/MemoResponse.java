package com.techie.backend.memo.dto;

import lombok.Data;

@Data
public class MemoResponse {
    private String content;
    private String noteTime;
    private Long videoId;
}
