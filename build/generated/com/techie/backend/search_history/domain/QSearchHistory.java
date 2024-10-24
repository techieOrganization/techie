package com.techie.backend.search_history.domain;

import static com.querydsl.core.types.PathMetadataFactory.*;

import com.querydsl.core.types.dsl.*;

import com.querydsl.core.types.PathMetadata;
import javax.annotation.processing.Generated;
import com.querydsl.core.types.Path;
import com.querydsl.core.types.dsl.PathInits;


/**
 * QSearchHistory is a Querydsl query type for SearchHistory
 */
@Generated("com.querydsl.codegen.DefaultEntitySerializer")
public class QSearchHistory extends EntityPathBase<SearchHistory> {

    private static final long serialVersionUID = 1845339082L;

    private static final PathInits INITS = PathInits.DIRECT2;

    public static final QSearchHistory searchHistory = new QSearchHistory("searchHistory");

    public final NumberPath<Long> id = createNumber("id", Long.class);

    public final StringPath query = createString("query");

    public final DateTimePath<java.time.LocalDateTime> searchDate = createDateTime("searchDate", java.time.LocalDateTime.class);

    public final com.techie.backend.user.entity.QUser user;

    public QSearchHistory(String variable) {
        this(SearchHistory.class, forVariable(variable), INITS);
    }

    public QSearchHistory(Path<? extends SearchHistory> path) {
        this(path.getType(), path.getMetadata(), PathInits.getFor(path.getMetadata(), INITS));
    }

    public QSearchHistory(PathMetadata metadata) {
        this(metadata, PathInits.getFor(metadata, INITS));
    }

    public QSearchHistory(PathMetadata metadata, PathInits inits) {
        this(SearchHistory.class, metadata, inits);
    }

    public QSearchHistory(Class<? extends SearchHistory> type, PathMetadata metadata, PathInits inits) {
        super(type, metadata, inits);
        this.user = inits.isInitialized("user") ? new com.techie.backend.user.entity.QUser(forProperty("user")) : null;
    }

}

