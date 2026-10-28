package fr.bmad.callbacks;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record CallbackRequestInput(
        @NotBlank(message = "Le prénom est obligatoire.")
        String firstName,
        @NotBlank(message = "Le nom est obligatoire.")
        String lastName,
        @NotBlank(message = "Le téléphone est obligatoire.")
        @Pattern(
                regexp = "\\+?[0-9][0-9().\\s-]{5,18}[0-9]",
                message = "Saisissez un numéro de téléphone valide."
        )
        String phone
) {
    public boolean hasValidDigitCount() {
        long digits = phone.chars().filter(Character::isDigit).count();
        return digits >= 7 && digits <= 15;
    }
}
