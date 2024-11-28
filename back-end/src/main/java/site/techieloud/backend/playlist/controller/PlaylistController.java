
package site.techieloud.backend.playlist.controller;


import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.playlist.dto.PlaylistRequest;
import site.techieloud.backend.playlist.dto.PlaylistResponse;
import site.techieloud.backend.playlist.service.PlaylistService;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@Tag(name = "사용자 재생목록 API", description = "사용자 재생목록 관련 API 엔드포인트")
@RequestMapping("/api/playlists")
@CrossOrigin(origins = "http://localhost:3000")
@RestController
@RequiredArgsConstructor
public class PlaylistController {
    private final PlaylistService playlistService;

    @PostMapping
    public ResponseEntity<Boolean> createPlaylist(
            @AuthenticationPrincipal UserDetailsCustom userDetails,
            @RequestBody PlaylistRequest.CreatePlaylist request) {
        return ResponseEntity.ok(playlistService.createPlaylist(userDetails, request));
    }

    @GetMapping
    public ResponseEntity<PlaylistResponse.Overview> getPlaylists(
            @AuthenticationPrincipal UserDetailsCustom userDetails) {
        return ResponseEntity.ok(playlistService.getPlaylists(userDetails));
    }


    @GetMapping("/{playlistId}")
    public ResponseEntity<PlaylistResponse.Details> getPlaylistDetails(
            @AuthenticationPrincipal UserDetailsCustom userDetails,
            @PathVariable Long playlistId) {
        PlaylistResponse.Details playlistResponse = playlistService.getPlaylistDetails(playlistId, userDetails);
        return ResponseEntity.ok(playlistResponse);
    }

    @PutMapping("/{playlistId}")
    public ResponseEntity<PlaylistResponse.UpdatePlaylist> updatePlaylist(
            @AuthenticationPrincipal UserDetailsCustom userDetails,
            @RequestBody PlaylistRequest.UpdatePlaylist request,
            @PathVariable("playlistId") Long playlistId) {
        PlaylistResponse.UpdatePlaylist response = playlistService.updatePlaylist(userDetails, request, playlistId);
        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{playlistId}")
    public ResponseEntity<Boolean> deletePlaylist(
            @AuthenticationPrincipal UserDetailsCustom userDetails,
            @PathVariable("playlistId") Long playlistId) {
        Boolean isDeleted = playlistService.deletePlaylist(userDetails, playlistId);
        return ResponseEntity.ok(isDeleted);
    }
}