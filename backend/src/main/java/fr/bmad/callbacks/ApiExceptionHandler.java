package fr.bmad.callbacks;

import org.springframework.dao.DataAccessException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.LinkedHashMap;
import java.util.Map;

@RestControllerAdvice
public class ApiExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException.class)
    ResponseEntity<ValidationErrorResponse> invalidFields(MethodArgumentNotValidException exception) {
        Map<String, String> errors = new LinkedHashMap<>();
        for (FieldError fieldError : exception.getBindingResult().getFieldErrors()) {
            errors.putIfAbsent(fieldError.getField(), fieldError.getDefaultMessage());
        }
        return ResponseEntity.badRequest().body(new ValidationErrorResponse(
                "Vérifiez les champs signalés.",
                errors
        ));
    }

    @ExceptionHandler(InvalidCallbackRequestException.class)
    ResponseEntity<ValidationErrorResponse> invalidRequest(InvalidCallbackRequestException exception) {
        return ResponseEntity.badRequest().body(new ValidationErrorResponse(
                "Vérifiez les champs signalés.",
                Map.of("phone", exception.getMessage())
        ));
    }

    @ExceptionHandler(BadCredentialsException.class)
    ResponseEntity<ErrorResponse> invalidCredentials(BadCredentialsException exception) {
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                .body(new ErrorResponse("Identifiant ou mot de passe incorrect."));
    }

    @ExceptionHandler(DataAccessException.class)
    ResponseEntity<ErrorResponse> storageUnavailable(DataAccessException exception) {
        return ResponseEntity.status(HttpStatus.SERVICE_UNAVAILABLE)
                .body(new ErrorResponse("Enregistrement indisponible. Veuillez réessayer."));
    }

    public record ValidationErrorResponse(String message, Map<String, String> errors) {
    }

    public record ErrorResponse(String message) {
    }
}
