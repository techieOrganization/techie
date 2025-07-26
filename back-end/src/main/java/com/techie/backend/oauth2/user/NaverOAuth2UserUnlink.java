package com.techie.backend.oauth2.user;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;
import org.springframework.web.util.UriComponentsBuilder;

@RequiredArgsConstructor
@Component
public class NaverOAuth2UserUnlink implements OAuth2UserUnlink {

    private static final String URL = "https://nid.naver.com/oauth2.0/token";
    private final RestClient restClient;

    @Value("${spring.security.oauth2.client.registration.naver.client-id}")
    private String clientId;
    @Value("${spring.security.oauth2.client.registration.naver.client-secret}")
    private String clientSecret;

    @Override
    public void unlink(String accessToken) {
        String url = UriComponentsBuilder.fromHttpUrl(URL)
                .queryParam("service_provider", "NAVER")
                .queryParam("grant_type", "delete")
                .queryParam("client_id", clientId)
                .queryParam("client_secret", clientSecret)
                .queryParam("access_token", accessToken)
                .toUriString();

        UnlinkResponse response = restClient
                .get()
                .uri(url)
                .retrieve()
                .body(UnlinkResponse.class);

        if (response != null && !"success".equalsIgnoreCase(response.getResult())) {
            throw new RuntimeException("네이버 Unlink에 실패하였습니다.");
        }
    }

    @Getter
    @RequiredArgsConstructor
    public static class UnlinkResponse {
        @JsonProperty("access_token")
        private final String accessToken;
        private final String result;
    }
}
