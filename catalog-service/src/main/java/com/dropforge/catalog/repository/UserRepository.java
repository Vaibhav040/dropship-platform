package com.dropforge.catalog.repository;

import com.dropforge.catalog.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, String> {
    // We need this custom method so Spring Security can look up users by email during login
    Optional<User> findByEmail(String email);
}