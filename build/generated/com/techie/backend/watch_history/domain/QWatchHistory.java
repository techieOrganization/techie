package com.techie.backend.watch_history.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QWatchHistory is a Querydsl query type for WatchHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QWatchHistory extends EntityPathBase<WatchHistory> {

    private static final long serialVersionUID = 43447612L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QWatchHistory watchHistory = new QWatchHistory("watchHistory");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.techie.backend.user.entity.QUser user;

    public final com.techie.backend.video.domain.QVideo video;

    public QWatchHistory(String variable) {
        this(WatchHistory.class, forVariable(variable), INITS);
    }

    public QWatchHistory(Path<? extends WatchHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QWatchHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QWatchHistory(PathMetadata metadata, PathInits inits) {
        this(WatchHistory.class, metadata, inits);
    }

    public QWatchHistory(Class<? extends WatchHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.techie.backend.user.entity.QUser(forProperty("user")) : null;
        this.video = inits.isInitialized("video") ? new com.techie.backend.video.domain.QVideo(forProperty("video")) : null;
    }

}

