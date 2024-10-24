package com.techie.backend.memo.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QMemo is a Querydsl query type for Memo
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QMemo extends EntityPathBase<Memo> {

    private static final long serialVersionUID = 1092251001L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QMemo memo = new QMemo("memo");

    public final StringPath content = createString("content");

    public final DateTimePath<java.time.LocalDateTime> createDate = createDateTime("createDate", java.time.LocalDateTime.class);

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final DateTimePath<java.time.LocalDateTime> modifyDate = createDateTime("modifyDate", java.time.LocalDateTime.class);

    public final com.techie.backend.user.entity.QUser user;

    public final com.techie.backend.video.domain.QVideo video;

    public QMemo(String variable) {
        this(Memo.class, forVariable(variable), INITS);
    }

    public QMemo(Path<? extends Memo> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QMemo(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QMemo(PathMetadata metadata, PathInits inits) {
        this(Memo.class, metadata, inits);
    }

    public QMemo(Class<? extends Memo> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.techie.backend.user.entity.QUser(forProperty("user")) : null;
        this.video = inits.isInitialized("video") ? new com.techie.backend.video.domain.QVideo(forProperty("video")) : null;
    }

}

