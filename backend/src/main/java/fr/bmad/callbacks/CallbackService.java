package fr.bmad.callbacks;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CallbackService {
    private final CallbackRequestRepository repository;

    public CallbackService(CallbackRequestRepository repository) {
        this.repository = repository;
    }

    @Transactional
    public CallbackRequestResponse create(CallbackRequestInput input) {
        if (!input.hasValidDigitCount()) {
            throw new InvalidCallbackRequestException("Saisissez un numéro de téléphone valide.");
        }

        CallbackRequest saved = repository.save(new CallbackRequest(
                input.firstName().trim(),
                input.lastName().trim(),
                input.phone().trim()
        ));
        return CallbackRequestResponse.from(saved);
    }

    @Transactional(readOnly = true)
    public List<CallbackRequestResponse> findAll() {
        return repository.findAllByOrderByIdAsc().stream()
                .map(CallbackRequestResponse::from)
                .toList();
    }
}
