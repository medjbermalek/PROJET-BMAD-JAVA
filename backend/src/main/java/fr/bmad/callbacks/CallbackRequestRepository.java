package fr.bmad.callbacks;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CallbackRequestRepository extends JpaRepository<CallbackRequest, Long> {
    List<CallbackRequest> findAllByOrderByIdAsc();
}
