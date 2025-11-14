package com.stayease.backend.service;

import com.stayease.backend.dto.BookingRequest;
import com.stayease.backend.model.*;
import com.stayease.backend.repository.BookingRepository;
import com.stayease.backend.repository.HotelRepository;
import com.stayease.backend.repository.RoomRepository;
import com.stayease.backend.repository.UserRepository;
import com.stayease.backend.service.impl.BookingServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.*;
import static org.mockito.Mockito.*;

class BookingServiceImplTest {

    @Mock
    private BookingRepository bookingRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private HotelRepository hotelRepository;

    @Mock
    private RoomRepository roomRepository;

    @InjectMocks
    private BookingServiceImpl bookingService;

    private User testUser;
    private Hotel testHotel;
    private Room testRoom;
    private BookingRequest testBookingRequest;

    @BeforeEach
    void setUp() {
        MockitoAnnotations.openMocks(this);

        testUser = new User();
        testUser.setId(1L);
        testUser.setUsername("testuser");

        testHotel = new Hotel();
        testHotel.setId(1L);
        testHotel.setName("Test Hotel");

        testRoom = new Room();
        testRoom.setId(10L);
        testRoom.setHotel(testHotel);
        testRoom.setPricePerNight(100.0);
        testRoom.setAvailable(true);

        testBookingRequest = new BookingRequest();
        testBookingRequest.setHotelId(1L);
        testBookingRequest.setRoomId(10L);
        testBookingRequest.setCheckIn(LocalDate.now().plusDays(1));
        testBookingRequest.setCheckOut(LocalDate.now().plusDays(3));
        testBookingRequest.setGuests(2);
        testBookingRequest.setGuestName("Test Guest");
        testBookingRequest.setGuestEmail("test@example.com");
        testBookingRequest.setGuestPhone("1234567890");
    }

    @Test
    void testCreateBooking_Success() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(testRoom));
        when(bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(Collections.emptyList());

        Booking savedBooking = new Booking();
        savedBooking.setId(100L);
        savedBooking.setStatus(BookingStatus.PENDING);
        savedBooking.setTotalAmount(200.0);

        when(bookingRepository.save(any(Booking.class))).thenReturn(savedBooking);

        Booking result = bookingService.createBooking(1L, testBookingRequest);

        assertNotNull(result);
        assertEquals(100L, result.getId());
        assertEquals(BookingStatus.PENDING, result.getStatus());
        verify(bookingRepository, times(1)).save(any(Booking.class));
    }

    @Test
    void testCreateBooking_UserNotFound() {
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        Exception exception = assertThrows(IllegalArgumentException.class, () -> {
            bookingService.createBooking(1L, testBookingRequest);
        });

        assertEquals("User not found", exception.getMessage());
    }

    @Test
    void testCreateBooking_RoomConflict() {
        when(userRepository.findById(1L)).thenReturn(Optional.of(testUser));
        when(hotelRepository.findById(1L)).thenReturn(Optional.of(testHotel));
        when(roomRepository.findById(10L)).thenReturn(Optional.of(testRoom));

        Booking conflictingBooking = new Booking();
        conflictingBooking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findByRoomIdAndCheckInLessThanEqualAndCheckOutGreaterThanEqual(
                anyLong(), any(LocalDate.class), any(LocalDate.class)))
                .thenReturn(List.of(conflictingBooking));

        Exception exception = assertThrows(IllegalStateException.class, () -> {
            bookingService.createBooking(1L, testBookingRequest);
        });

        assertTrue(exception.getMessage().contains("Room already booked"));
    }

    @Test
    void testGetBookingsByUser() {
        Booking booking1 = new Booking();
        booking1.setId(1L);
        Booking booking2 = new Booking();
        booking2.setId(2L);

        when(bookingRepository.findByUserId(1L))
                .thenReturn(List.of(booking1, booking2));

        List<Booking> bookings = bookingService.getBookingsByUser(1L);

        assertEquals(2, bookings.size());
        verify(bookingRepository, times(1)).findByUserId(1L);
    }

    @Test
    void testCancelBooking_Success() {
        Long bookingId = 1L;
        Long userId = 1L;

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setUser(testUser);
        booking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.cancelBooking(userId, bookingId);

        assertEquals(BookingStatus.CANCELLED, result.getStatus());
        verify(bookingRepository, times(1)).save(booking);
    }

    @Test
    void testCancelBooking_NotAllowed() {
        Long bookingId = 1L;
        Long differentUserId = 2L;

        User differentUser = new User();
        differentUser.setId(2L);

        Booking booking = new Booking();
        booking.setId(bookingId);
        booking.setUser(testUser); // User ID 1
        booking.setStatus(BookingStatus.CONFIRMED);

        when(bookingRepository.findById(bookingId)).thenReturn(Optional.of(booking));

        Exception exception = assertThrows(SecurityException.class, () -> {
            bookingService.cancelBooking(differentUserId, bookingId);
        });

        assertEquals("Not allowed", exception.getMessage());
    }

    @Test
    void testGetBookingById() {
        Booking booking = new Booking();
        booking.setId(1L);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));

        Optional<Booking> result = bookingService.getBookingById(1L);

        assertTrue(result.isPresent());
        assertEquals(1L, result.get().getId());
    }

    @Test
    void testUpdateBookingStatus() {
        Booking booking = new Booking();
        booking.setId(1L);
        booking.setStatus(BookingStatus.PENDING);

        when(bookingRepository.findById(1L)).thenReturn(Optional.of(booking));
        when(bookingRepository.save(any(Booking.class))).thenReturn(booking);

        Booking result = bookingService.updateBookingStatus(1L, BookingStatus.CONFIRMED);

        assertEquals(BookingStatus.CONFIRMED, result.getStatus());
        verify(bookingRepository, times(1)).save(booking);
    }
}