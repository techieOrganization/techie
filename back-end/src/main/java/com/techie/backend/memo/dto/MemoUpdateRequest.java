package com.techie.backend.memo.dto;

import lombok.Data;

@Data
public class MemoUpdateRequest {
    private String title;
    private String content;
}
