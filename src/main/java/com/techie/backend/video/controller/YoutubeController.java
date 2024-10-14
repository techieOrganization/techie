package com.techie.backend.video.controller;

import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.service.YoutubeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class YoutubeController {
    private final YoutubeService youtubeService;

//    @GetMapping("/videos/{categoryId}")
//    public VideoResponse listBackendVideo(@PathVariable Long categoryId) {
//
//    }

}
