package com.nuitinfo.Decathlon.model;
import lombok.Data;
@Data
public class AuthRequest {
    private String email;
    private String password;
    private String pseudo;
    private String sportFocus;
    private String painArea;
}