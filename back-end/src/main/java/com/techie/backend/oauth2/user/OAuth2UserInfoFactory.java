package com.techie.backend.oauth2.user;

import com.techie.backend.global.exception.user.OAuth2AuthenticationProcessingException;

import java.util.Map;

public class OAuth2UserInfoFactory {
    public static OAuth2UserInfo getOAuth2UserInfo(String provider, String accessToken, Map<String, Object> attributes) {
        if (OAuth2Provider.GOOGLE.getProvider().equals(provider)) {
            return new GoogleOAuth2UserInfo(accessToken, attributes);
        } else if (OAuth2Provider.NAVER.getProvider().equals(provider)) {
            return new NaverOAuth2UserInfo(accessToken, attributes);
        } else {
            throw new OAuth2AuthenticationProcessingException(provider + "을/를 통한 로그인은 불가합니다.");
        }
    }
}
