
package com.techie.backend.playlist.service;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.playlist.dto.PlaylistRequest;
import com.techie.backend.playlist.dto.PlaylistResponse;
import org.springframework.stereotype.Service;


@Service
public interface PlaylistService {

    Boolean createPlaylist(UserDetailsCustom userDetails, PlaylistRequest.CreatePlaylist request);

    PlaylistResponse.Details getPlaylistDetails(Long userId, Long playlistId, UserDetailsCustom userDetails);

    PlaylistResponse.Overview getPlaylists(UserDetailsCustom userDetails);

    PlaylistResponse.UpdatePlaylist updatePlaylist(UserDetailsCustom userDetails, PlaylistRequest.UpdatePlaylist request, Long playlistId);

    Boolean deletePlaylist(UserDetailsCustom userDetails, Long playlistId);
}