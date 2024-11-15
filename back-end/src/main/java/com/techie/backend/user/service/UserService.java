package com.techie.backend.user.service;

import com.techie.backend.global.security.UserDetailsCustom;
import com.techie.backend.user.domain.User;
import com.techie.backend.user.dto.UserRequest;
import com.techie.backend.user.dto.UserResponse;

public interface UserService {
    Boolean joinProcess(UserRequest.Register request);
    UserResponse.Information getUser(UserDetailsCustom userDetails);
    Boolean updateUser(UserDetailsCustom userDetails, UserRequest.Update request);
    Boolean deleteUser(String email);
    User getUserFromSecurityContext(UserDetailsCustom userDetailsCustom);
}