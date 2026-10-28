package fr.bmad.callbacks;

import org.junit.jupiter.api.Test;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;

import static org.junit.jupiter.api.Assertions.assertEquals;

class ApiExceptionHandlerTest {
    @Test
    void storageFailureReturnsRetryableServiceError() {
        ApiExceptionHandler handler = new ApiExceptionHandler();

        var response = handler.storageUnavailable(
                new DataAccessResourceFailureException("database unavailable")
        );

        assertEquals(HttpStatus.SERVICE_UNAVAILABLE, response.getStatusCode());
        assertEquals(
                "Enregistrement indisponible. Veuillez réessayer.",
                response.getBody().message()
        );
    }
}
