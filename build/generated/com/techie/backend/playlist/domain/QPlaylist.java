package com.techie.backend.playlist.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QPlaylist is a Querydsl query type for Playlist
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QPlaylist extends EntityPathBase<Playlist> {

    private static final long serialVersionUID = -515964247L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QPlaylist playlist = new QPlaylist("playlist");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath name = createString("name");

    public final com.techie.backend.user.entity.QUser user;

    public QPlaylist(String variable) {
        this(Playlist.class, forVariable(variable), INITS);
    }

    public QPlaylist(Path<? extends Playlist> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QPlaylist(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QPlaylist(PathMetadata metadata, PathInits inits) {
        this(Playlist.class, metadata, inits);
    }

    public QPlaylist(Class<? extends Playlist> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.techie.backend.user.entity.QUser(forProperty("user")) : null;
    }

}

