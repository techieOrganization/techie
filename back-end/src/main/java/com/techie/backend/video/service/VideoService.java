package com.techie.backend.video.service;

import com.techie.backend.video.domain.Category;
import com.techie.backend.video.domain.Video;
import com.techie.backend.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Slf4j
public class VideoService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final VideoRepository videoRepository;


    public String getVideoIdsAsString(Category category) {
        return videoRepository.findByCategory(category).stream()
                .map(Video::getVideoId)
                .collect(Collectors.joining(","));
    }

    public String listVideos(Category category) {
        String ids = getVideoIdsAsString(category);
        String url = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host("www.googleapis.com")
                .path("/youtube/v3/videos")
                .queryParam("part", "snippet")
                .queryParam("id", ids)
                .queryParam("key", apiKey)
                .build()
                .toUriString();


        ResponseEntity<String> response = restClient.get()
                .uri(url)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .retrieve()
                .toEntity(String.class);


        return response.getBody();
    }


}
