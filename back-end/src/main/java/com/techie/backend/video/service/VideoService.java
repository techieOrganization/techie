package com.techie.backend.video.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techie.backend.video.domain.Category;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.domain.SliceImpl;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;
import java.util.ArrayList;
import java.util.List;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class VideoService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    private String buildPlaylistUri(Category category) {
        return UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/playlistItems")
                .queryParam("part", "snippet,contentDetails")
                .queryParam("playlistId", category.getPlaylistId())
                .queryParam("maxResults", 50)
                .queryParam("key", apiKey)
                .toUriString();
    }

    private String buildVideoUri(String videoIds) {
        return UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/videos")
                .queryParam("part", "snippet,contentDetails")
                .queryParam("id", videoIds)
                .queryParam("key", apiKey)
                .toUriString();
    }

    public Slice<VideoResponse> fetchVideosByCategory(Category category, Pageable pageable) throws JsonProcessingException {
        // youtube api [재생목록을 통한] 영상 조회 요청 url
        String playlistUri = buildPlaylistUri(category);

        // 응답에서 영상 id 만을 추출
        String videoIds = getVideoIds(getYoutubeResponse(playlistUri).getBody());

        // youtube api [영상 ID를 통한] 영상 조회 요청 url
        String videoUri = buildVideoUri(videoIds);

        // 응답 json 을 DTO 에 매핑 후 반환
        return convertJsonToVideoDTO(getYoutubeResponse(videoUri).getBody(), pageable);
    }

    public Slice<VideoResponse> fetchVideosByQuery(String query, Category category, Pageable pageable) throws JsonProcessingException {
        String playlistUri = buildPlaylistUri(category);

        JsonNode rootNode = objectMapper.readTree(getYoutubeResponse(playlistUri).getBody());
        JsonNode itemsNode = rootNode.get("items");
        List<String> videoIds = new ArrayList<>();

        // [검색어가 포함된 제목을 가지고 있는] 영상의 id 만을 추출
        for(JsonNode item : itemsNode) {
            String title = item.get("snippet").get("title").asText();
            if (title.contains(query)) {
                videoIds.add(item.get("contentDetails").get("videoId").asText());
            }
        }

        // youtube api [영상 ID를 통한] 영상 조회 요청 url
        String videoUri = buildVideoUri(String.join(",", videoIds));

        // 응답 json 을 DTO 에 매핑 후 반환
        return convertJsonToVideoDTO(getYoutubeResponse(videoUri).getBody(), pageable);
    }

    private String getVideoIds(String jsonResponse) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.get("items");
        List<String> videoIds = new ArrayList<>();
        for (JsonNode itemNode : itemsNode) {
            videoIds.add(itemNode.get("contentDetails").get("videoId").asText());
        }
        return String.join(",", videoIds);
    }

    private ResponseEntity<String> getYoutubeResponse(String uri) {
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

    public Slice<VideoResponse> convertJsonToVideoDTO(String jsonResponse, Pageable pageable) {
        List<VideoResponse> videoResponses = new ArrayList<>();
        int start = (int) pageable.getOffset();
        int end = start + pageable.getPageSize();
        boolean hasNext = false;

        try {
            JsonNode rootNode = objectMapper.readTree(jsonResponse);
            JsonNode itemsNode = rootNode.get("items");
            if (itemsNode.isArray()) {
                int current = 0;  // 현재 위치

                for (JsonNode itemNode : itemsNode) {
                    if (current >= end) break;

                    if (current >= start) {
                        JsonNode snippetNode = itemNode.get("snippet");
                        VideoResponse videoResponse = objectMapper.treeToValue(snippetNode, VideoResponse.class);

                        String duration = itemNode.get("contentDetails").get("duration").asText();
                        videoResponse.setDuration(duration);
                        videoResponse.setVideoId(itemNode.get("id").asText());

                        videoResponses.add(videoResponse);
                    }
                    current++;
                }
            }
            hasNext = end < rootNode.get("items").size();

        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert itemNode to VideoResponse: " + e.getMessage());
        }

        return new SliceImpl<>(videoResponses, pageable, hasNext);
    }

}
