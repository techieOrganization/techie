package com.techie.backend.user.domain;

import com.techie.backend.global.enums.CodeEnum;

public enum Role implements CodeEnum<String> {

    ADMIN("ADMIN"), USER("USER");

    private final String code;

    Role(String code) {
        this.code = code;
    }

    public String getCode() {
        return code;
    }

}
