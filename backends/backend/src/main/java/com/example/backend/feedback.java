package com.example.backend;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.time.LocalDateTime;
import java.util.List;

@Document(collection = "feedbacks")
@lombok.Data
@lombok.AllArgsConstructor
@lombok.Builder
class Feedback {
    @Id String id;
    String message;
    Integer rating;
    LocalDateTime createdAt, updatedAt;
    User user;

    
    public Feedback() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (rating == null) rating = 5;
    }
}

interface FeedbackRepo extends MongoRepository<Feedback, String> {
    List<Feedback> findByUser_IdOrderByCreatedAtDesc(String userId);
}