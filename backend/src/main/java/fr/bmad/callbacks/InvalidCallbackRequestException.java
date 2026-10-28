package fr.bmad.callbacks;

class InvalidCallbackRequestException extends RuntimeException {
    InvalidCallbackRequestException(String message) {
        super(message);
    }
}
