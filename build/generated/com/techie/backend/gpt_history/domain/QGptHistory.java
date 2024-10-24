package com.techie.backend.gpt_history.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QGptHistory is a Querydsl query type for GptHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QGptHistory extends EntityPathBase<GptHistory> {

    private static final long serialVersionUID = 573066812L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QGptHistory gptHistory = new QGptHistory("gptHistory");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final com.techie.backend.user.entity.QUser user;

    public QGptHistory(String variable) {
        this(GptHistory.class, forVariable(variable), INITS);
    }

    public QGptHistory(Path<? extends GptHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QGptHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QGptHistory(PathMetadata metadata, PathInits inits) {
        this(GptHistory.class, metadata, inits);
    }

    public QGptHistory(Class<? extends GptHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.techie.backend.user.entity.QUser(forProperty("user")) : null;
    }

}

