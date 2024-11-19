package com.techie.backend.gpt.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.gpt.domain.Gpt;
import com.techie.backend.gpt.dto.GptRequest;
import com.techie.backend.gpt.dto.GptResponse;
import com.techie.backend.gpt.repository.GptRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.CloseableHttpResponse;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.ParseException;
import org.apache.hc.core5.http.io.entity.EntityUtils;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GptServiceImpl implements GptService {

    private static final Logger logger = LoggerFactory.getLogger(GptServiceImpl.class);
    private final ObjectMapper objectMapper;
    private final GptRepository gptRepository;
    private final UserRepository userRepository;

    @Value("${openai.api.key}")
    private String API_KEY;
    @Value("${openai.api.url}")
    private String API_URL;

    @Override
    public ResponseEntity<GptResponse> questionAndAnswer(GptRequest gptRequest, UserDetailsCustom userDetails) {
        String request = gptRequest.getRequest();

        if (request == null || request.isEmpty()) {
            throw new IllegalArgumentException("The GPT request cannot be null or empty");
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(API_URL);
            httpPost.setHeader("Authorization", "Bearer " + API_KEY);
            httpPost.setHeader("Content-Type", "application/json");

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");
            body.put("messages", List.of(Map.of("role", "user", "content", request)));

            StringEntity entity = new StringEntity(objectMapper.writeValueAsString(body), ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);

            try (CloseableHttpResponse response = httpClient.execute(httpPost)) {
                int statusCode = response.getCode();
                String responseBody = EntityUtils.toString(response.getEntity());

                if (statusCode != HttpStatus.OK.value()) {
                    logger.error("Response Status Code: {}", statusCode);
                    throw new RuntimeException("Failed to get a response from GPT. Status code: " + statusCode);
                }

                JsonNode rootNode = objectMapper.readTree(responseBody);
                String gptContent = rootNode.path("choices").get(0).path("message").path("content").asText();
                User user = userRepository.findByEmail((userDetails.getUsername()));

                Gpt gpt = new Gpt();
                gpt.updateRequest(request);
                gpt.updateResponse(gptContent);
                gpt.assignUser(user);
                gptRepository.save(gpt);

                GptResponse gptResponse = new GptResponse();
                gptResponse.setRequest(request);
                gptResponse.setResponse(gptContent);

                return new ResponseEntity<>(gptResponse, HttpStatus.OK);
            } catch (ParseException e) {
                throw new RuntimeException("Error parsing the GPT response", e);
            }
        } catch (IOException e) {
            throw new RuntimeException(e);
        }
    }
}