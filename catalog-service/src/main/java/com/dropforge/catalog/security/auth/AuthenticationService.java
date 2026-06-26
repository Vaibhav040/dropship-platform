package com.dropforge.catalog.security.auth;

import com.dropforge.catalog.model.User;
import com.dropforge.catalog.repository.UserRepository;
import com.dropforge.catalog.security.JwtService;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthenticationService {

    private final UserRepository repository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public AuthenticationService(UserRepository repository, PasswordEncoder passwordEncoder, JwtService jwtService, AuthenticationManager authenticationManager) {
        this.repository = repository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.authenticationManager = authenticationManager;
    }

    public AuthenticationResponse register(RegisterRequest request) {
        // 1. Create a new User entity
        var user = new User();
        user.setFirstName(request.firstName());
        user.setLastName(request.lastName());
        user.setEmail(request.email());
        user.setPassword(passwordEncoder.encode(request.password())); // NEVER store plaintext passwords!
        user.setRole(User.Role.USER);
        
        // 2. Save them to PostgreSQL
        repository.save(user);
        
        // 3. Generate their JWT token
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.Collections.emptyList());
        var jwtToken = jwtService.generateToken(userDetails);
        
        return new AuthenticationResponse(jwtToken);
    }

    public AuthenticationResponse authenticate(AuthenticationRequest request) {
        // 1. Spring Security checks the password here. If it's wrong, it throws an exception.
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        
        // 2. If we get here, the password was correct. Fetch the user from the DB.
        var user = repository.findByEmail(request.email()).orElseThrow();
                
        // 3. Generate a new JWT token for this session
        var userDetails = new org.springframework.security.core.userdetails.User(
                user.getEmail(), user.getPassword(), java.util.Collections.emptyList());
        var jwtToken = jwtService.generateToken(userDetails);
        
        return new AuthenticationResponse(jwtToken);
    }
}