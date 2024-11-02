package com.techie.backend.global.enums;

import com.techie.backend.user.domain.Role;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ConverterUserRole extends AbstractCodedEnumConverter<Role,String> {
    public ConverterUserRole() {
        super(Role.class);
    }
}