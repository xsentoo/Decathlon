package com.nuitinfo.Decathlon.model;

import lombok.Data;

@Data
public class ProfileUpdateRequest {
    private String sportFocus;
    private String painArea;
}