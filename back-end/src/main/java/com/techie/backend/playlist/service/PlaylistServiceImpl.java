package com.techie.backend.playlist.service;


import com.techie.backend.global.exception.playlist.PlaylistNotFoundException;
import com.techie.backend.global.exception.playlist.VideoNotFoundException;
import com.techie.backend.global.exception.user.UserNotFoundException;
import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.playlist.dto.PlaylistRequest;
import com.techie.backend.playlist.dto.PlaylistResponse;
import com.techie.backend.playlist.repository.PlaylistRepository;
import com.techie.backend.playlist_video.domain.PlaylistVideo;
import com.techie.backend.playlist_video.repository.PlaylistVideoRepository;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.service.UserService;
import com.techie.backend.video.domain.Video;
import com.techie.backend.video.dto.VideoResponse;
import com.techie.backend.video.repository.VideoRepository;
import com.techie.backend.video.service.VideoService;
import lombok.RequiredArgsConstructor;
import org.modelmapper.ModelMapper;
import org.modelmapper.PropertyMap;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaylistServiceImpl implements PlaylistService {
    private final PlaylistRepository playlistRepository;
    private final PlaylistVideoRepository playlistVideoRepository;
    private final VideoRepository videoRepository;
    private final UserService userService;
    private final VideoService videoService;
    private final ModelMapper modelMapper;

    @Transactional
    @Override
    public Boolean createPlaylist(UserDetailsCustom userDetails, PlaylistRequest.CreatePlaylist request) {
        User user = userService.getUserFromSecurityContext(userDetails);

        Playlist playlist = Playlist.builder()
                .name(request.getPlaylistName())
                .user(user)
                .build();
        playlistRepository.save(playlist);

        if (request.getVideoId() == null || request.getVideoId().isEmpty()) {
            return true;
        }

        String videoId = request.getVideoId();
        String videoUri = videoService.buildVideoUri(videoId);
        String videoResponseJson = videoService.getYoutubeResponse(videoUri).getBody();
        List<VideoResponse> videoResponses = videoService.convertJsonToVideoDTOWithoutPaging(videoResponseJson);

        if (videoResponses.isEmpty()) {
            return false;
        }

        VideoResponse videoResponse = videoResponses.get(0);
        Video video = videoRepository.findByVideoId(videoId)
                .orElseGet(() -> {
                    Video newVideo = Video.builder()
                            .videoId(videoId)
                            .title(videoResponse.getTitle())
                            .build();
                    return videoRepository.save(newVideo);
                });

        playlist.addVideo(video);
        playlistRepository.save(playlist);

        return true;
    }


    @Override
    public PlaylistResponse.Overview getPlaylists(UserDetailsCustom userDetails) {
        User user = userService.getUserFromSecurityContext(userDetails);
        List<Playlist> playlists = playlistRepository.findAllByUser(user);

        if (playlists.isEmpty()) {
            return new PlaylistResponse.Overview(List.of());
        }

        List<PlaylistResponse.Overview.PlaylistSummary> playlistSummaries = playlists.stream()
                .map(playlist -> {
                    List<Video> videos = playlistVideoRepository.findVideosByPlaylist(playlist);

                    List<String> videoNames = videos.stream()
                            .map(Video::getTitle)
                            .toList();

                    return new PlaylistResponse.Overview.PlaylistSummary(
                            playlist.getId(),
                            playlist.getName(),
                            videoNames.size());
                })
                .collect(Collectors.toList());

        return new PlaylistResponse.Overview(playlistSummaries);
    }

    @Override
    public PlaylistResponse.Details getPlaylistDetails(Long userId, Long playlistId, UserDetailsCustom userDetails) {
        User user = userService.getUserFromSecurityContext(userDetails);
        if (user == null || !user.getId().equals(userId)) {
            throw new UserNotFoundException();
        }
        Playlist playlist = playlistRepository.findByUserIdAndId(userId, playlistId);
        if (playlist == null) {
            throw new PlaylistNotFoundException();
        }

        PlaylistResponse.Details response = modelMapper.map(playlist, PlaylistResponse.Details.class);

        List<PlaylistResponse.PlaylistDetails> videos = playlist.getPlaylistVideos().stream()
                .map(playlistVideo -> modelMapper.map(playlistVideo.getVideo(), PlaylistResponse.PlaylistDetails.class))
                .collect(Collectors.toList());
        response.setVideos(videos);

        return response;
    }


    @Transactional
    @Override
    public PlaylistResponse.UpdatePlaylist updatePlaylist(UserDetailsCustom userDetails, PlaylistRequest.UpdatePlaylist request, Long playlistId) {
        User user = userService.getUserFromSecurityContext(userDetails);
        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);

        if (request.getAddVideoIds() != null && !request.getAddVideoIds().isEmpty() && request.getRemoveVideoIds() != null && !request.getRemoveVideoIds().isEmpty()) {
            throw new IllegalArgumentException("수정과 삭제가 동시에 이루어질 수 없습니다.");
        }

        if (request.getPlaylistName() != null && !request.getPlaylistName().isBlank()) {
            playlist.updateName(request.getPlaylistName());
        }

        if (request.getAddVideoIds() != null && !request.getAddVideoIds().isEmpty()) {
            for (String videoId : request.getAddVideoIds()) {
                Video video = videoRepository.findById(videoId)
                        .orElseGet(() -> {
                            String videoUri = videoService.buildVideoUri(videoId);
                            String videoResponseJson = videoService.getYoutubeResponse(videoUri).getBody();
                            List<VideoResponse> videoResponses = videoService.convertJsonToVideoDTOWithoutPaging(videoResponseJson);

                            if (videoResponses.isEmpty()) {
                                throw new VideoNotFoundException();
                            }

                            VideoResponse videoResponse = videoResponses.get(0);
                            Video newVideo = Video.builder()
                                    .videoId(videoId)
                                    .title(videoResponse.getTitle())
                                    .build();
                            videoRepository.save(newVideo);
                            return newVideo;
                        });

                boolean videoExists = playlistVideoRepository.existsByPlaylistAndVideo(playlist, video);
                if (videoExists) {
                    throw new IllegalArgumentException("이미 존재하는 값입니다.");
                }

                playlist.addVideo(video);
            }
        }

        if (request.getRemoveVideoIds() != null && !request.getRemoveVideoIds().isEmpty()) {
            for (String videoId : request.getRemoveVideoIds()) {
                Video video = videoRepository.findById(videoId)
                        .orElseThrow(VideoNotFoundException::new);

                boolean videoExists = playlistVideoRepository.existsByPlaylistAndVideo(playlist, video);
                if (!videoExists) {
                    throw new IllegalArgumentException("이미 삭제한 값입니다.");
                }

                PlaylistVideo playlistVideo = playlistVideoRepository.findByPlaylistAndVideo(playlist, video)
                        .orElseThrow(VideoNotFoundException::new);

                playlist.removeVideo(video, playlistVideoRepository);
            }
        }

        playlistRepository.save(playlist);

        return new PlaylistResponse.UpdatePlaylist(playlist.getId(), playlist.getName());
    }




    @Transactional
    @Override
    public Boolean deletePlaylist(UserDetailsCustom userDetails, Long playlistId) {
        User user = userService.getUserFromSecurityContext(userDetails);
        Playlist playlist = playlistRepository.findByIdAndUser(playlistId, user);

        if (playlist == null) {
            throw new PlaylistNotFoundException();
        }

        playlistRepository.delete(playlist);

        return true;
    }
}