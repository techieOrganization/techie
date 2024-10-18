package com.techie.backend.video.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.techie.backend.video.domain.Category;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/videos")
@Slf4j
public class VideoController {
    private final VideoService videoService;

    @GetMapping("/{category}")
    public List<VideoResponse> listCategoryVideo(@PathVariable Category category) throws JsonProcessingException {
        return videoService.fetchVideosByCategory(category);
    }

    @GetMapping
    public List<VideoResponse> searchVideo(@RequestParam String q) throws JsonProcessingException {
        return videoService.videoSearch(q);
    }
}
