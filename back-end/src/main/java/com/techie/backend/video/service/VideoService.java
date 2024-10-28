package com.techie.backend.video.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techie.backend.video.domain.Category;
import com.techie.backend.video.domain.Video;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class VideoService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final VideoRepository videoRepository;
    private final ObjectMapper objectMapper;

    public List<VideoResponse> fetchVideosByCategory(Category category) {
        String videoIds = getVideoIds(videoRepository.findByCategory(category));
        ResponseEntity<String> response = getYoutubeResponse(videoIds);
        return convertJsonToVideoDTO(response.getBody());
    }

    public List<VideoResponse> fetchVideosByQuery(String query) {
        String videoIds = getVideoIds(videoRepository.findByTitleContaining(query));
        ResponseEntity<String> response = getYoutubeResponse(videoIds);
        return convertJsonToVideoDTO(response.getBody());
    }

    private String getVideoIds(List<Video> findVideos) {
        return findVideos.stream().map(Video::getVideoId).collect(Collectors.joining(","));
    }

    private ResponseEntity<String> getYoutubeResponse(String videoIds) {
        String uri = UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/videos")
                .queryParam("part", "snippet,contentDetails")
                .queryParam("id", videoIds)
                .queryParam("key", apiKey)
                .build()
                .toUriString();

        return restClient.get()
                .uri(uri)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .retrieve()
                .onStatus(HttpStatusCode::isError, (request, response) -> {
                    throw new RuntimeException("Failed to fetch youtube videos. Status code: " + response.getStatusCode());
                })
                .toEntity(String.class);
    }

    public List<VideoResponse> convertJsonToVideoDTO(String jsonResponse) {
        List<VideoResponse> videoResponses = new ArrayList<>();

        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode itemsNode = rootNode.get("items");
            if (itemsNode.isArray()) {
                for (JsonNode itemNode : itemsNode) {
                    JsonNode snippetNode = itemNode.get("snippet");
                    VideoResponse videoResponse = objectMapper.treeToValue(snippetNode, VideoResponse.class);
                    String duration = itemNode.get("contentDetails").get("duration").asText();
                    videoResponse.setDuration(duration);
                    videoResponses.add(videoResponse);
                }
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert itemNode to VideoResponse: " + e.getMessage());
        }

        return videoResponses;
    }

}
