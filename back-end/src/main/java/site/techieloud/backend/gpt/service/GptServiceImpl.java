package site.techieloud.backend.gpt.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import site.techieloud.backend.global.exception.gpt.GptRequestException;
import site.techieloud.backend.global.exception.gpt.InvalidGptRequestException;
import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.gpt.domain.Gpt;
import site.techieloud.backend.gpt.dto.GptRequest;
import site.techieloud.backend.gpt.dto.GptResponse;
import site.techieloud.backend.gpt.repository.GptRepository;
import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.user.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.apache.hc.client5.http.classic.methods.HttpPost;
import org.apache.hc.client5.http.impl.classic.CloseableHttpClient;
import org.apache.hc.client5.http.impl.classic.HttpClients;
import org.apache.hc.client5.http.protocol.HttpClientContext;
import org.apache.hc.core5.http.ClassicHttpResponse;
import org.apache.hc.core5.http.ContentType;
import org.apache.hc.core5.http.HttpHost;
import org.apache.hc.core5.http.io.entity.StringEntity;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.net.URISyntaxException;
import java.net.URL;
import java.nio.charset.StandardCharsets;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class GptServiceImpl implements GptService {

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
            throw new InvalidGptRequestException();
        }

        try (CloseableHttpClient httpClient = HttpClients.createDefault()) {
            HttpPost httpPost = new HttpPost(API_URL);
            httpPost.setHeader("Authorization", "Bearer " + API_KEY);
            httpPost.setHeader("Content-Type", "application/json");

            String apiHost = new URL(API_URL).getHost();
            HttpHost targetHost = HttpHost.create("https://" + apiHost);

            Map<String, Object> body = new HashMap<>();
            body.put("model", "gpt-3.5-turbo");
            body.put("messages", List.of(Map.of("role", "user", "content", request)));

            StringEntity entity = new StringEntity(objectMapper.writeValueAsString(body), ContentType.APPLICATION_JSON);
            httpPost.setEntity(entity);

            HttpClientContext context = HttpClientContext.create();

            try (ClassicHttpResponse response = httpClient.executeOpen(targetHost, httpPost, context)) {
                int statusCode = response.getCode();
                if (statusCode != HttpStatus.OK.value()) {
                    throw new GptRequestException();
                }

                String responseBody = new String(response.getEntity().getContent().readAllBytes(), StandardCharsets.UTF_8);

                JsonNode rootNode = objectMapper.readTree(responseBody);
                String gptContent = rootNode.path("choices").get(0).path("message").path("content").asText();
                User user = userRepository.findByEmail(userDetails.getUsername());

                Gpt gpt = new Gpt();
                gpt.updateRequest(request);
                gpt.updateResponse(gptContent);
                gpt.assignUser(user);
                gptRepository.save(gpt);

                GptResponse gptResponse = new GptResponse();
                gptResponse.setRequest(request);
                gptResponse.setResponse(gptContent);

                return new ResponseEntity<>(gptResponse, HttpStatus.OK);
            }
        } catch (IOException e) {
            throw new GptRequestException();
        } catch (URISyntaxException e) {
            throw new RuntimeException(e);
        }
    }
}