package com.techie.backend.user.service;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    Boolean register(UserRequest.Register userRequest);

    UserResponse.Information getLoggedInUser(UserDetails userDetails);

    Boolean updateUser(UserDetails userDetails, UserRequest.Update userRequest);

    Boolean deleteUser(UserDetails userDetails);
}
