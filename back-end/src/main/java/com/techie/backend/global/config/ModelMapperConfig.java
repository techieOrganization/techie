package com.techie.backend.global.config;

import com.techie.backend.memo.domain.Memo;
import com.techie.backend.memo.dto.MemoResponse;
import com.techie.backend.playlist.domain.Playlist;
import com.techie.backend.playlist.dto.PlaylistResponse;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import static org.modelmapper.config.Configuration.*;

@Configuration
public class ModelMapperConfig {
    @Bean
    public ModelMapper modelMapper(){
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration()
                .setFieldAccessLevel(AccessLevel.PRIVATE)
                .setMatchingStrategy(MatchingStrategies.STRICT)
                .setFieldMatchingEnabled(true);

        modelMapper.typeMap(Memo.class, MemoResponse.class).addMappings(mapper ->
                mapper.map(src -> src.getVideo().getVideoId(), MemoResponse::setVideoId)
        );
        modelMapper.typeMap(Playlist.class, PlaylistResponse.Details.class).addMappings(mapper -> {
            mapper.map(Playlist::getId, PlaylistResponse.Details::setPlaylistId);
            mapper.map(Playlist::getName, PlaylistResponse.Details::setPlaylistName);
        });
        return modelMapper;
    }
}
