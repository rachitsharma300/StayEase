package com.stayease.backend.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.stayease.backend.dto.HotelResponseDTO;
import com.stayease.backend.dto.RoomResponseDTO;
import com.stayease.backend.model.Hotel;
import com.stayease.backend.model.Room;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.service.HotelService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;

import java.util.List;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

public class HotelControllerTest {

    private MockMvc mockMvc;

    @Mock
    private HotelService hotelService;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private HotelController hotelController;

    private ObjectMapper objectMapper = new ObjectMapper();

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);
        mockMvc = MockMvcBuilders.standaloneSetup(hotelController).build();
    }

    // --------------------------------------------------------
    // 1️⃣ GET ALL HOTELS
    // --------------------------------------------------------
    @Test
    void testGetAllHotels() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Taj");

        when(hotelService.getAll()).thenReturn(List.of(hotel));

        mockMvc.perform(get("/api/hotels"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].name").value("Taj"));

        verify(hotelService, times(1)).getAll();
    }

    // --------------------------------------------------------
    // 2️⃣ GET HOTEL BY ID
    // --------------------------------------------------------
    @Test
    void testGetHotelById() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("Taj Hotel");

        when(hotelService.getById(1L)).thenReturn(hotel);

        mockMvc.perform(get("/api/hotels/1"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("Taj Hotel"));

        verify(hotelService).getById(1L);
    }

    // --------------------------------------------------------
    // 3️⃣ SEARCH HOTELS BY LOCATION
    // --------------------------------------------------------
    @Test
    void testSearchHotels() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setCity("Delhi");

        when(hotelService.searchByLocation("Delhi")).thenReturn(List.of(hotel));

        mockMvc.perform(get("/api/hotels/search")
                        .param("location", "Delhi"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].city").value("Delhi"));

        verify(hotelService).searchByLocation("Delhi");
    }

    // --------------------------------------------------------
    // 4️⃣ GET ROOMS FOR HOTEL
    // --------------------------------------------------------
    @Test
    void testGetHotelRooms() throws Exception {
        Room room = new Room();
        room.setId(1L);
        room.setRoomNumber("101");

        when(roomRepository.findByHotelId(1L)).thenReturn(List.of(room));

        mockMvc.perform(get("/api/hotels/1/rooms"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$[0].id").value(1))
                .andExpect(jsonPath("$[0].roomNumber").value("101"));

        verify(roomRepository).findByHotelId(1L);
    }

    // --------------------------------------------------------
    // 5️⃣ CREATE HOTEL
    // --------------------------------------------------------
    @Test
    void testCreateHotel() throws Exception {
        Hotel hotel = new Hotel();
        hotel.setId(1L);
        hotel.setName("New Hotel");

        when(hotelService.create(any(Hotel.class))).thenReturn(hotel);

        mockMvc.perform(post("/api/hotels")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(hotel)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id").value(1))
                .andExpect(jsonPath("$.name").value("New Hotel"));

        verify(hotelService).create(any(Hotel.class));
    }

    // --------------------------------------------------------
    // 6️⃣ UPDATE HOTEL
    // --------------------------------------------------------
    @Test
    void testUpdateHotel() throws Exception {
        Hotel updatedHotel = new Hotel();
        updatedHotel.setId(1L);
        updatedHotel.setName("Updated Name");

        when(hotelService.update(eq(1L), any(Hotel.class))).thenReturn(updatedHotel);

        mockMvc.perform(put("/api/hotels/1")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(updatedHotel)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.name").value("Updated Name"));

        verify(hotelService).update(eq(1L), any(Hotel.class));
    }

    // --------------------------------------------------------
    // 7️⃣ DELETE HOTEL
    // --------------------------------------------------------
    @Test
    void testDeleteHotel() throws Exception {

        doNothing().when(hotelService).delete(1L);

        mockMvc.perform(delete("/api/hotels/1"))
                .andExpect(status().isOk())
                .andExpect(content().string("Hotel deleted successfully"));

        verify(hotelService).delete(1L);
    }

}
