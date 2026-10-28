package fr.bmad.callbacks;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.mock.web.MockHttpSession;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;

import static org.hamcrest.Matchers.hasSize;
import static org.hamcrest.Matchers.is;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class CallbackApiTest {
    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private CallbackRequestRepository repository;

    @BeforeEach
    void clearRequests() {
        repository.deleteAll();
    }

    @Test
    void visitorCanCreateRequestButCannotListWithoutAuthentication() throws Exception {
        mockMvc.perform(post("/api/callbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Camille","lastName":"Martin","phone":"+33 6 12 34 56 78"}
                                """))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.firstName", is("Camille")));

        mockMvc.perform(get("/api/callbacks"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void advisorCanListRequestsAndLogoutInvalidatesSession() throws Exception {
        mockMvc.perform(post("/api/callbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Camille","lastName":"Martin","phone":"+33 6 12 34 56 78"}
                                """))
                .andExpect(status().isCreated());

        MvcResult login = mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"admin","password":"admin"}
                                """))
                .andExpect(status().isNoContent())
                .andReturn();
        MockHttpSession session = (MockHttpSession) login.getRequest().getSession(false);

        mockMvc.perform(get("/api/callbacks").session(session))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(1)))
                .andExpect(jsonPath("$[0].lastName", is("Martin")));

        mockMvc.perform(post("/api/auth/logout").session(session))
                .andExpect(status().isNoContent());

        mockMvc.perform(get("/api/callbacks").session(session))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void invalidPhoneAndMissingFieldsAreRejected() throws Exception {
        mockMvc.perform(post("/api/callbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":"Camille","lastName":"Martin","phone":"12ab"}
                                """))
                .andExpect(status().isBadRequest());

        mockMvc.perform(post("/api/callbacks")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"firstName":" ","lastName":"","phone":"0612345678"}
                                """))
                .andExpect(status().isBadRequest());
    }

    @Test
    void incorrectCredentialsDoNotCreateAnAuthenticatedSession() throws Exception {
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"username":"admin","password":"incorrect"}
                                """))
                .andExpect(status().isUnauthorized());

        mockMvc.perform(get("/api/callbacks"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void phoneDigitCountAcceptsSevenToFifteenDigitsOnly() throws Exception {
        for (String phone : new String[]{"1234567", "123456789012345"}) {
            mockMvc.perform(post("/api/callbacks")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"firstName":"Camille","lastName":"Martin","phone":"%s"}
                                    """.formatted(phone)))
                    .andExpect(status().isCreated());
        }

        for (String phone : new String[]{"+123456", "1234567890123456"}) {
            mockMvc.perform(post("/api/callbacks")
                            .contentType(MediaType.APPLICATION_JSON)
                            .content("""
                                    {"firstName":"Camille","lastName":"Martin","phone":"%s"}
                                    """.formatted(phone)))
                    .andExpect(status().isBadRequest());
        }
    }
}
