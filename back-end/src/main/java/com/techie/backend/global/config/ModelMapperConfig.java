package com.techie.backend.global.config;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

    @Bean
    public ModelMapper modelMapper() {
        ModelMapper modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);

        modelMapper.typeMap(User.class, UserRequest.class)
                .addMappings(mapper -> {
                    mapper.skip(UserRequest::setEmail);
                    mapper.skip(UserRequest::setNickname);
                    mapper.skip(UserRequest::setCreatedDate);
                    mapper.skip(UserRequest::setModifiedDate);
                });

        return modelMapper;
    }


}
