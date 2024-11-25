package com.techie.backend.playlist_video.repository;


import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.playlist_video.domain.PlaylistVideo;
import com.techie.backend.playlist_video.domain.QPlaylistVideo;
import com.techie.backend.video.domain.QVideo;
import com.techie.backend.video.domain.Video;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

import static com.techie.backend.playlist_video.domain.QPlaylistVideo.playlistVideo;

@Repository
@RequiredArgsConstructor
public class PlaylistVideoRepositoryImpl implements PlaylistVideoRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public boolean existsByPlaylistAndVideo(Playlist playlist, Video video) {
        Long count = queryFactory
                .select(playlistVideo.id)
                .from(playlistVideo)
                .where(playlistEq(playlist), videoEq(video))
                .fetchFirst();
        return count != null;
    }

    @Override
    public Optional<PlaylistVideo> findByPlaylistAndVideo(Playlist playlist, Video video) {
        PlaylistVideo result = queryFactory
                .selectFrom(playlistVideo)
                .where(playlistEq(playlist), videoEq(video))
                .fetchOne();
        return Optional.ofNullable(result);
    }

    @Override
    public List<Video> findVideosByPlaylist(Playlist playlist) {
        QPlaylistVideo qPlaylistVideo = QPlaylistVideo.playlistVideo;
        QVideo qVideo = QVideo.video;

        return queryFactory.select(qVideo)
                .from(qPlaylistVideo)
                .join(qPlaylistVideo.video, qVideo)
                .where(qPlaylistVideo.playlist.eq(playlist))
                .fetch();
    }

    private BooleanExpression playlistEq(Playlist playlist) {
        return playlist != null ? playlistVideo.playlist.eq(playlist) : null;
    }

    private BooleanExpression videoEq(Video video) {
        return video != null ? playlistVideo.video.eq(video) : null;
    }
}