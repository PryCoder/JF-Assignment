package com.example.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.*;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.annotation.Bean;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@SpringBootApplication
@RestController
@CrossOrigin(origins = "http://localhost:5173")
public class App {
    public static void main(String[] a) { SpringApplication.run(App.class, a); }

    @Autowired UserRepo users;
    @Autowired FeedbackRepo repo;
    Map<String, User> tokens = new ConcurrentHashMap<>();

    record AuthReq(String username, String password) {}
    record RegReq(String username, String email, String password) {}
    record AuthRes(String token, String username, String role) {}
    record FbReq(String message, Integer rating) {}
    record FbRes(String id, String message, Integer rating, LocalDateTime updatedAt, String username) {
        static FbRes of(Feedback f) { return new FbRes(f.id, f.message, f.rating, f.updatedAt, f.user.username); }
    }

    User me(String header) {
        if (header == null || !header.startsWith("Bearer ")) throw new RuntimeException("Unauthorized");
        User u = tokens.get(header.substring(7));
        if (u == null) throw new RuntimeException("Unauthorized");
        return u;
    }

    AuthRes session(User u) {
        String t = UUID.randomUUID().toString();
        tokens.put(t, u);
        return new AuthRes(t, u.username, u.role.name());
    }

    @PostMapping("/api/auth/register")
    AuthRes register(@RequestBody RegReq r) {
        if (users.existsByUsername(r.username())) throw new RuntimeException("Username exists");
        if (users.existsByEmail(r.email())) throw new RuntimeException("Email exists");
        return session(users.save(User.builder()
                .username(r.username()).email(r.email())
                .password(r.password()).role(Role.USER).build()));
    }

    @PostMapping("/api/auth/login")
    AuthRes login(@RequestBody AuthReq r) {
        User u = users.findByUsername(r.username())
        .orElseThrow(() -> new RuntimeException("Invalid"));
        if (!u.password.equals(r.password())) throw new RuntimeException("Invalid");
        return session(u);
    }

    @PostMapping("/api/feedback")
    FbRes create(@RequestBody FbReq r, @RequestHeader("Authorization") String h) {
        return FbRes.of(repo.save(Feedback.builder()
                .message(r.message())
                .rating(r.rating() != null ? r.rating() : 5)
                .user(me(h)).build()));
    }

   @GetMapping("/api/feedback/my")
List<FbRes> mine(@RequestHeader("Authorization") String h) {
    return repo.findByUser_IdOrderByCreatedAtDesc(me(h).id)
    .stream()
    .map(FbRes::of)
    .toList();
}

    @PutMapping("/api/feedback/{id}")
    FbRes update(@PathVariable String id, @RequestBody FbReq r, @RequestHeader("Authorization") String h) {
        User u = me(h);
        Feedback f = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (u.role != Role.ADMIN && !f.user.id.equals(u.id)) throw new RuntimeException("Forbidden");
        f.message = r.message();
        if (r.rating() != null) f.rating = r.rating();
        f.updatedAt = LocalDateTime.now();
        return FbRes.of(repo.save(f));
    }

    @DeleteMapping("/api/feedback/{id}")
    ResponseEntity<Void> delete(@PathVariable String id, @RequestHeader("Authorization") String h) {
        User u = me(h);
        Feedback f = repo.findById(id).orElseThrow(() -> new RuntimeException("Not found"));
        if (u.role != Role.ADMIN && !f.user.id.equals(u.id)) throw new RuntimeException("Forbidden");
        repo.delete(f);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/api/admin/feedbacks")
    List<FbRes> all(@RequestHeader("Authorization") String h) {
        if (me(h).role != Role.ADMIN) throw new RuntimeException("Forbidden");
        return repo.findAll().stream().map(FbRes::of).toList();
    }

    @Bean CommandLineRunner seed(UserRepo u) {
        return a -> { if (!u.existsByUsername("admin"))
            u.save(User.builder().username("admin").email("admin@test.com")
                    .password("admin123").role(Role.ADMIN).build()); };
    }

    @ExceptionHandler(RuntimeException.class)
    ResponseEntity<?> err(RuntimeException e) {
        return ResponseEntity
        .badRequest()
        .body(Map.of("error", e.getMessage()));
    }
}