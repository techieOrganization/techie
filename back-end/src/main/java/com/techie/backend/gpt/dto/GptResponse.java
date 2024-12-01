package com.techie.backend.gpt.dto;

import lombok.Data;

@Data
public class GptResponse {

    private String request;
    private String response;
}