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

    public List<VideoResponse> fetchVideosByCategory(Category category) throws JsonProcessingException {
        String videoIds = getVideoIds(videoRepository.findByCategory(category));
        String url = getUrl(videoIds);
        ResponseEntity<String> response = getYoutubeResponse(url);
        return convertJsonToVideoDTO(response.getBody());
    }

    public List<VideoResponse> fetchVideosByQuery(String query) throws JsonProcessingException {
        String videoIds = getVideoIds(videoRepository.findByTitleContaining(query));
        String url = getUrl(videoIds);
        ResponseEntity<String> response = getYoutubeResponse(url);
        return convertJsonToVideoDTO(response.getBody());
    }

    private String getVideoIds(List<Video> findVideos) {
        return findVideos.stream().map(Video::getVideoId).collect(Collectors.joining(","));
    }

    private String getUrl(String videoIds) {
        return UriComponentsBuilder.newInstance()
                .scheme("https")
                .host("www.googleapis.com")
                .path("/youtube/v3/videos")
                .queryParam("part", "snippet,contentDetails")
                .queryParam("id", videoIds)
                .queryParam("key", apiKey)
                .build()
                .toUriString();
    }

    private ResponseEntity<String> getYoutubeResponse(String url) {
        return restClient.get()
                .uri(url)
                .header("Content-Type", "application/json")
                .header("Accept", "application/json")
                .retrieve()
                .toEntity(String.class);
    }

    public List<VideoResponse> convertJsonToVideoDTO(String jsonResponse) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.get("items");
        List<VideoResponse> videoResponses = new ArrayList<>();
        if (itemsNode.isArray()) {
            for (JsonNode itemNode : itemsNode) {
                JsonNode snippetNode = itemNode.get("snippet");
                JsonNode contentDetailsNode = itemNode.get("contentDetails");
                VideoResponse videoResponse = objectMapper.readValue(snippetNode.toPrettyString(), VideoResponse.class);
                String duration = contentDetailsNode.get("duration").asText();
                videoResponse.setDuration(duration);
                videoResponses.add(videoResponse);
            }
        }
        return videoResponses;
    }

}
