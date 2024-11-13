package com.techie.backend.global.config;

import com.techie.backend.memo.domain.Memo;
import com.techie.backend.memo.dto.MemoResponse;
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

        return modelMapper;
    }
}
