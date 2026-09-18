package com.example.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.Optional;

enum Role { USER, ADMIN }

@Document(collection = "users")
@lombok.Data @lombok.NoArgsConstructor @lombok.AllArgsConstructor @lombok.Builder
class User {
    @Id String id;
    String username;
    String email;
    String password;
    Role role;
}

interface UserRepo extends MongoRepository<User, String> {
    Optional<User> findByUsername(String u);
    boolean existsByUsername(String u);
    boolean existsByEmail(String e);
}