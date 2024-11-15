package com.techie.backend.playlist.repository;

import com.querydsl.jpa.impl.JPAQueryFactory;
import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.user.domain.User;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;
import java.util.List;

import static com.techie.backend.playlist.domain.QPlaylist.playlist;
import static com.techie.backend.user.domain.QUser.user;

@Repository
@RequiredArgsConstructor
public class PlaylistRepositoryImpl implements PlaylistRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public Playlist findByUserIdAndId(Long userId, Long playlistId) {
        return queryFactory.selectFrom(playlist)
                .join(playlist.user, user)
                .where(user.id.eq(userId), playlist.id.eq(playlistId))
                .fetchOne();
    }

    @Override
    public List<Playlist> findAllByUser(User user) {
        return queryFactory.selectFrom(playlist)
                .where(playlist.user.eq(user))
                .fetch();
    }

    @Override
    public Playlist findByIdAndUser(Long playlistId, User user) {
        return queryFactory.selectFrom(playlist)
                .join(playlist.user)
                .where(playlist.id.eq(playlistId), playlist.user.eq(user))
                .fetchOne();
    }
}