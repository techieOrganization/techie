package com.techie.backend.global.config;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.domain.User;
import org.modelmapper.ModelMapper;
import org.modelmapper.convention.MatchingStrategies;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class ModelMapperConfig {

//    @Bean
//    public ModelMapper modelMapper() {
//        ModelMapper modelMapper = new ModelMapper();
//        modelMapper.getConfiguration().setMatchingStrategy(MatchingStrategies.STRICT);
//
//        modelMapper.typeMap(User.class, UserRequest.Login.class)
//                .addMappings(mapper -> {
//                    mapper.skip(UserRequest.Login::setEmail);
//                    mapper.skip(UserRequest.Login::setPassword);
//                });
//
//        return modelMapper;
//    }
}
