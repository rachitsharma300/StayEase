package com.stayease.backend.controller;

import com.stayease.backend.model.Room;
import com.stayease.backend.service.SearchService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class SearchControllerTest {

    private MockMvc mockMvc;

    @Mock
    private SearchService searchService;

    @InjectMocks
    private SearchController searchController;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(searchController).build();
    }

    // --------------------------------------------------------
    // 1️⃣ Test available rooms search
    // --------------------------------------------------------
    @Test
    void testAvailableRooms() throws Exception {
        Room room = new Room();
        room.setId(1L);
        room.setRoomNumber("101");

        when(searchService.findAvailableRooms(anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(room));

        mockMvc.perform(get("/api/search/rooms")
                        .param("hotelId", "1")
                        .param("checkIn", "2025-01-01")
                        .param("checkOut", "2025-01-05"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].roomNumber").value("101"));
    }
}
