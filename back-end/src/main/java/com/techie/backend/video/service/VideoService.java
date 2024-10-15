package com.techie.backend.video.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techie.backend.video.domain.Category;
import com.techie.backend.video.domain.Video;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
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
public class VideoService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final VideoRepository videoRepository;
    private final ObjectMapper objectMapper;


    public String getVideoIdsAsString(Category category) {
        return videoRepository.findByCategory(category).stream()
                .map(Video::getVideoId)
                .collect(Collectors.joining(","));
    }

    public List<VideoResponse> fetchVideosByCategory(Category category) throws JsonProcessingException {
        String ids = getVideoIdsAsString(category);
        String url = UriComponentsBuilder.newInstance()
                .scheme("https")
                .host("www.googleapis.com")
                .path("/youtube/v3/videos")
                .queryParam("part", "snippet,contentDetails")
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


        return convertJsonToVideoDTO(response.getBody());
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
