package com.techie.backend.user.service;

import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

import java.security.Principal;


public interface UserService {
    
    Boolean joinProcess(UserRequest.Register request);

    Boolean updateUser(String username, UserRequest.Update request);

    Boolean deleteUser(String username);

}
