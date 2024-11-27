
package com.techie.backend.playlist.service;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.playlist.dto.PlaylistRequest;
import com.techie.backend.playlist.dto.PlaylistResponse;


public interface PlaylistService {
    Boolean createPlaylist(UserDetailsCustom userDetails, PlaylistRequest.CreatePlaylist request);
    PlaylistResponse.Overview getPlaylists(UserDetailsCustom userDetails);
    PlaylistResponse.Details getPlaylistDetails(Long playlistId, UserDetailsCustom userDetails);
    PlaylistResponse.UpdatePlaylist updatePlaylist(UserDetailsCustom userDetails, PlaylistRequest.UpdatePlaylist request, Long playlistId);
    Boolean deletePlaylist(UserDetailsCustom userDetails, Long playlistId);
}