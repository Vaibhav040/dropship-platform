package com.dropforge.catalog.security.auth;

public record AuthenticationRequest (
    String email, 
    String password
) {
    
}
