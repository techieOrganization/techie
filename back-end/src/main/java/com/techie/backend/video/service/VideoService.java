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
import java.util.Arrays;


@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
@Slf4j
public class VideoService {
    @Value("${youtube.api.key}")
    private String apiKey;

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public String buildPlaylistUri(String playlistId) {
        return UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/playlistItems")
                .queryParam("part", "snippet,contentDetails")
                .queryParam("playlistId", playlistId)
                .queryParam("maxResults", 50)
                .queryParam("key", apiKey)
                .toUriString();
    }

    public String buildVideoUri(String videoIds) {
        return UriComponentsBuilder.fromHttpUrl("https://www.googleapis.com/youtube/v3/videos")
                .queryParam("part", "snippet,contentDetails")
                .queryParam("id", videoIds)
                .queryParam("key", apiKey)
                .toUriString();
    }

    public Slice<VideoResponse> fetchVideosByCategory(Category category, Pageable pageable) throws JsonProcessingException {
        // youtube api [재생목록을 통한] 영상 조회 요청 url
        String playlistUri = buildPlaylistUri(category.getPlaylistId());

        // 응답에서 영상 id 만을 추출
        String videoIds = getVideoIds(getYoutubeResponse(playlistUri).getBody());

        // youtube api [영상 ID를 통한] 영상 조회 요청 url
        String videoUri = buildVideoUri(videoIds);

        // 응답 json 을 DTO 에 매핑 후 반환
        return convertJsonToVideoDTO(getYoutubeResponse(videoUri).getBody(), pageable);
    }

    public Slice<VideoResponse> fetchVideosByQuery(String query, Category category, Pageable pageable) throws JsonProcessingException {
        String playlistUri = buildPlaylistUri(category.getPlaylistId());

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

    public String getVideoIds(String jsonResponse) throws JsonProcessingException {
        JsonNode rootNode = objectMapper.readTree(jsonResponse);
        JsonNode itemsNode = rootNode.get("items");
        List<String> videoIds = new ArrayList<>();
        for (JsonNode itemNode : itemsNode) {
            videoIds.add(itemNode.get("contentDetails").get("videoId").asText());
        }
        return String.join(",", videoIds);
    }

    public ResponseEntity<String> getYoutubeResponse(String uri) {
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

    public Slice<VideoResponse> fetchVideosFromAllCategories(Pageable pageable) throws JsonProcessingException {
        List<VideoResponse> allVideos = new ArrayList<>();

        // 모든 카테고리 순회하며 영상 수집
        for (Category category : Category.values()) {
            String playlistUri = buildPlaylistUri(category.getPlaylistId());
            String videoIds = getVideoIds(getYoutubeResponse(playlistUri).getBody());
            String videoUri = buildVideoUri(videoIds);

            // 영상 데이터를 DTO로 변환하여 리스트에 추가
            List<VideoResponse> categoryVideos = convertJsonToVideoDTOWithoutPaging(getYoutubeResponse(videoUri).getBody());
            allVideos.addAll(categoryVideos);
        }

        // 전체 리스트를 페이징 처리하여 Slice로 반환
        return createSlice(allVideos, pageable);
    }

    // JSON 응답을 VideoResponse 리스트로 변환 (페이징 처리 없이 모든 데이터 반환)
    private List<VideoResponse> convertJsonToVideoDTOWithoutPaging(String jsonResponse) {
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
                    videoResponse.setVideoId(itemNode.get("id").asText());

                    videoResponses.add(videoResponse);
                }
            }
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to convert JSON to VideoResponse: " + e.getMessage());
        }

        return videoResponses;
    }

    // 전체 리스트를 페이징하여 반환
    private Slice<VideoResponse> createSlice(List<VideoResponse> videoResponses, Pageable pageable) {
        int start = (int) pageable.getOffset();
        int end = Math.min(start + pageable.getPageSize(), videoResponses.size());

        List<VideoResponse> pagedList = videoResponses.subList(start, end);
        boolean hasNext = end < videoResponses.size();

        return new SliceImpl<>(pagedList, pageable, hasNext);
    }
}
