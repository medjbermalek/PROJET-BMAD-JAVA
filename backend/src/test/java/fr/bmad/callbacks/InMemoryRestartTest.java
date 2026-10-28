package fr.bmad.callbacks;

import org.junit.jupiter.api.Test;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.context.ConfigurableApplicationContext;

import static org.junit.jupiter.api.Assertions.assertEquals;

class InMemoryRestartTest {
    private static final String DATABASE_URL = "jdbc:h2:mem:restart_contract";

    @Test
    void inMemoryRequestsAreClearedWhenTheApplicationRestarts() {
        ConfigurableApplicationContext firstRun = startApplication();
        try {
            firstRun.getBean(CallbackRequestRepository.class)
                    .save(new CallbackRequest("Camille", "Martin", "0612345678"));
            assertEquals(1, firstRun.getBean(CallbackRequestRepository.class).count());
        } finally {
            firstRun.close();
        }

        ConfigurableApplicationContext secondRun = startApplication();
        try {
            assertEquals(0, secondRun.getBean(CallbackRequestRepository.class).count());
        } finally {
            secondRun.close();
        }
    }

    private ConfigurableApplicationContext startApplication() {
        return new SpringApplicationBuilder(CallbackApplication.class)
                .properties(
                        "server.address=127.0.0.1",
                        "server.port=0",
                        "spring.datasource.url=" + DATABASE_URL
                )
                .run();
    }
}
