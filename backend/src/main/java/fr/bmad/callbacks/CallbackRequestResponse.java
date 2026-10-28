package fr.bmad.callbacks;

public record CallbackRequestResponse(Long id, String firstName, String lastName, String phone) {
    static CallbackRequestResponse from(CallbackRequest request) {
        return new CallbackRequestResponse(
                request.getId(),
                request.getFirstName(),
                request.getLastName(),
                request.getPhone()
        );
    }
}
