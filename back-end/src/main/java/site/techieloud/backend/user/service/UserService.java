package site.techieloud.backend.user.service;

import site.techieloud.backend.global.security.UserDetailsCustom;
import site.techieloud.backend.user.domain.User;
import site.techieloud.backend.user.dto.UserRequest;
import site.techieloud.backend.user.dto.UserResponse;

public interface UserService {
    Boolean joinProcess(UserRequest.Register request);
    UserResponse.Information getUser(UserDetailsCustom userDetails);
    Boolean updateUser(UserDetailsCustom userDetails, UserRequest.Update request);
    User getUserFromSecurityContext(UserDetailsCustom userDetailsCustom);
    Boolean deleteUser(UserDetailsCustom userDetails, UserRequest.Delete request);
}