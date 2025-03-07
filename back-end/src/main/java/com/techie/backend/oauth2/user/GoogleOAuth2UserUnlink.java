package com.techie.backend.oauth2.user;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.client.RestClient;

@RequiredArgsConstructor
@Component
public class GoogleOAuth2UserUnlink implements OAuth2UserUnlink {
    private static final String URL = "https://oauth2.googleapis.com/revoke";
    private final RestClient restClient;

    @Override
    public void unlink(String accessToken) {
        MultiValueMap<String, String> params = new LinkedMultiValueMap<>();
        params.add("token", accessToken);
        restClient.post()
                .uri(URL)
                .body(params)
                .retrieve()
                .body(String.class);
    }
}
