package com.techie.backend.user.service;

import com.techie.backend.user.dto.UserRequest;

public interface UserService {
    
    Boolean joinProcess(UserRequest.Register request);

}
