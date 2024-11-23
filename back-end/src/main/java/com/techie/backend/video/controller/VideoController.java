package com.techie.backend.video.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.techie.backend.video.domain.Category;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/videos")
@Slf4j
@CrossOrigin(origins = "http://localhost:3000") 
public class VideoController {
    private final VideoService videoService;

    @GetMapping("/{category}")
    public Slice<VideoResponse> listCategoryVideo(@PathVariable("category") Category category, Pageable pageable) throws JsonProcessingException {
        return videoService.fetchVideosByCategory(category, pageable);
    }

    @GetMapping
    public Slice<VideoResponse> searchVideo(@RequestParam String query,
                                            @RequestParam Category category,
                                            Pageable pageable) throws JsonProcessingException {
        return videoService.fetchVideosByQuery(query, category, pageable);
    }

    @GetMapping("/list")
    public Slice<VideoResponse> AllVideos (Pageable pageable) throws JsonProcessingException {
        return videoService.fetchVideosFromAllCategories(pageable);
    }
}
