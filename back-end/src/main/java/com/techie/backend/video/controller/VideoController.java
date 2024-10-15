package com.techie.backend.video.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.techie.backend.video.domain.Category;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class VideoController {
    private final VideoService videoService;

    @GetMapping("/videos/{category}")
    public List<VideoResponse> listBackendVideo(@PathVariable Category category) throws JsonProcessingException {
        return videoService.fetchVideosByCategory(category);
    }
}
