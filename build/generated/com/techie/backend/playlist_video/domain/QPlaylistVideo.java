package com.techie.backend.playlist_video.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPlaylistVideo is a Querydsl query type for PlaylistVideo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPlaylistVideo extends EntityPathBase<PlaylistVideo> {

    private static final long serialVersionUID = -898023018L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPlaylistVideo playlistVideo = new QPlaylistVideo("playlistVideo");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.techie.backend.playlist.domain.QPlaylist playlist;

    public final com.techie.backend.video.domain.QVideo video;

    public QPlaylistVideo(String variable) {
        this(PlaylistVideo.class, forVariable(variable), INITS);
    }

    public QPlaylistVideo(Path<? extends PlaylistVideo> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPlaylistVideo(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPlaylistVideo(PathMetadata metadata, PathInits inits) {
        this(PlaylistVideo.class, metadata, inits);
    }

    public QPlaylistVideo(Class<? extends PlaylistVideo> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.playlist = inits.isInitialized("playlist") ? new com.techie.backend.playlist.domain.QPlaylist(forProperty("playlist"), inits.get("playlist")) : null;
        this.video = inits.isInitialized("video") ? new com.techie.backend.video.domain.QVideo(forProperty("video")) : null;
    }

}

