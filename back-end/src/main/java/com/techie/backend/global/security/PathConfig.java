package com.techie.backend.global.security;

import java.util.List;

public class PathConfig {

    // 접근 권한 : 로그인 여부 상관없음
    public static final List<String> PERMIT_ALL_PATHS = List.of(
            "/login",
            "/",
            "/v3/api-docs/**",
            "/swagger-ui/**",
            "/swagger-ui.html",
            "/swagger-resources/**",
            "/webjars/**",
            "/static/**",
            "/log.png",
            "/api/users/**",
            "/api/gpt/**",
            "/api/videos/**"
    );

    // 접근 권한 : 인증된 사용자 (JWT 필요)
    public static final List<String> AUTHENTICATED_PATHS = List.of(
            "/api/users/me",
            "/api/gpt/qna",
            "/api/memo"
    );

    // 접근 권한 : 어드민 관리자 (ROLE_ADMIN 만 접근 가능)
    public static final List<String> ADMIN_ONLY_PATHS = List.of(
            "/api/users/admin"
    );
}