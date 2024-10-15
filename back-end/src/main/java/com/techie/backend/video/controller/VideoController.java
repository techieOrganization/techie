package com.techie.backend.video.controller;

import com.techie.backend.video.domain.Category;
import com.techie.backend.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @GetMapping("/videos/{category}")
    public String listBackendVideo(@PathVariable Category category) {
        return videoService.listVideos(category);
    }

}
