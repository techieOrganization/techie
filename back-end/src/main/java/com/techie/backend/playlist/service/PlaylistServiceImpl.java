package com.techie.backend.playlist.service;

import com.techie.backend.global.exception.playlist.PlaylistNotFoundException;
import com.techie.backend.global.exception.playlist.VideoNotFoundException;
import com.techie.backend.global.exception.user.UserNotFoundException;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.playlist.dto.PlaylistRequest;
import com.techie.backend.playlist.dto.PlaylistResponse;
import com.techie.backend.playlist.repository.PlaylistRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.repository.UserRepository;
import com.techie.backend.video.domain.Video;
import com.techie.backend.video.repository.VideoRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final VideoRepository videoRepository;
    private final UserRepository userRepository;

    @Transactional
    @Override
    public Boolean createPlaylist(UserDetailsCustom userDetails, PlaylistRequest.CreatePlaylist request) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new UserNotFoundException();
        }

        Playlist playlist = Playlist.builder()
                .name(request.getName())
                .user(user)
                .build();
        playlistRepository.save(playlist);

        if (request.getVideoIds() != null && !request.getVideoIds().isEmpty()) {
            List<Video> videos = videoRepository.findAllById(request.getVideoIds());
            List<String> invalidIds = request.getVideoIds().stream()
                    .filter(id -> videos.stream().noneMatch(video -> video.getVideoId().equals(id)))
                    .toList();
            if (!invalidIds.isEmpty()) {
                throw new IllegalArgumentException("videoId가 유효하지 않습니다. : " + invalidIds);
            }
            for (Video video : videos) {
                playlist.addVideo(video);
            }
        }

        return true;
    }

    @Override
    public PlaylistResponse.Overview getPlaylists(UserDetailsCustom userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new UserNotFoundException();
        }
        List<Playlist> playlists = playlistRepository.findAllByUser(user);
        if (playlists.isEmpty()) {
            return new PlaylistResponse.Overview(List.of());
        }
        List<PlaylistResponse.Overview.PlaylistSummary> playlistSummaries = playlists.stream()
                .map(playlist -> new PlaylistResponse.Overview.PlaylistSummary(
                        playlist.getId(),
                        playlist.getName()
                ))
                .toList();

        return new PlaylistResponse.Overview(playlistSummaries);
    }

    @Override
    public PlaylistResponse.Details getPlaylistDetails(Long userId, Long playlistId, UserDetailsCustom userDetails) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null || !user.getId().equals(userId)) {
            throw new UserNotFoundException();
        }

        Playlist playlist = playlistRepository.findByUserIdAndId(userId, playlistId);
        if (playlist == null) {
            throw new PlaylistNotFoundException();
        }

        PlaylistResponse.Details response = new PlaylistResponse.Details();
        response.setPlaylistId(playlist.getId());
        response.setPlaylistName(playlist.getName());

        List<PlaylistResponse.PlaylistDetails> videos = playlist.getPlaylistVideos().stream()
                .map(playlistVideo -> {
                    Video video = playlistVideo.getVideo();
                    return new PlaylistResponse.PlaylistDetails(video);
                })
                .toList();
        response.setVideos(videos);

        return response;
    }

    @Override
    public PlaylistResponse.UpdatePlaylist updatePlaylist(UserDetailsCustom userDetails, PlaylistRequest.UpdatePlaylist request, Long playlistId) {
        User user = userRepository.findByEmail(userDetails.getUsername());

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);

        if (request.getName() != null && !request.getName().isBlank()) {
            playlist.updateName(request.getName());
        }

        if (request.getAddVideoIds() != null) {
            for (String videoId : request.getAddVideoIds()) {
                Video video = videoRepository.findById(videoId)
                        .orElseThrow(() -> new VideoNotFoundException());

                if (!playlist.hasVideo(video)) {
                    playlist.addVideo(video);
                }
            }
        }

        if (request.getRemoveVideoIds() != null) {
            for (String videoId : request.getRemoveVideoIds()) {
                Video video = videoRepository.findById(videoId)
                        .orElseThrow(() -> new VideoNotFoundException());

                if (playlist.hasVideo(video)) {
                    playlist.removeVideo(video);
                }
            }
        }
        playlistRepository.save(playlist);

        return new PlaylistResponse.UpdatePlaylist(playlist.getId(), playlist.getName());
    }

    @Override
    @Transactional
    public Boolean deletePlaylist(UserDetailsCustom userDetails, Long playlistId) {
        User user = userRepository.findByEmail(userDetails.getUsername());
        if (user == null) {
            throw new UserNotFoundException();
        }

        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);
        if (playlist == null) {
            throw new PlaylistNotFoundException();
        }

        playlistRepository.delete(playlist);

        return true;
    }
}