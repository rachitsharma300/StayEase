# 🏨 StayEase - Hotel Management System (HMS)

A full-featured Hotel Management System built with Spring Boot & React that supports:

- Role-based access control
- Hotel & room management
- Booking & reservation system
- Payment integration
- Admin dashboard analytics

---

## 🚀 Features
👥 Role-Based Access Control
| Role | Capabilities |
|------|--------------|
| **Admin**	| Manage hotels • View all bookings • System oversight |
| **Hotel** | Manager	Manage rooms • View bookings • Update availability |
| **User**	| Browse hotels • Book rooms • View booking history |

---

### 🏨 Hotel & Room Management
- Create and manage hotels with detailed information
- Add rooms with amenities and pricing
- Real-time availability tracking
- Search and filter hotels by location, price, amenities

---

### 📅 Booking System
- Secure room booking with date validation
- Prevent double booking conflicts
- Booking confirmation and status tracking
- Cancellation and modification support

---

### 💳 Payment Integration
- Razorpay payment gateway integration
- Secure payment processing
- Payment status tracking

---

### 🔐 Security & Authentication
- JWT-based secure authentication
- Password hashing using BCrypt
- Role-based API access restrictions
- CORS enabled for frontend integration

---

## 🛠 Tech Stack
### 🧩 Backend
| Component | Technology |

Framework	Spring Boot 3.x
| Framework | **Spring Boot 3.5.6** |
| Security | **Spring Security 6.5.5 + JWT** |
| Database | **MySQL + Spring Data JPA** |
| API Docs | **Swagger / OpenAPI 3.1** |
| Testing | **JUnit 5, Mockito** |
| Build Tool | **Maven** |

---

### ⚡ Frontend

| Component        | Technology            |
| ---------------- | --------------------- |
| Framework        | **React 18**          |
| Routing          | **React Router DOM**  |
| HTTP Client      | **Axios**             |
| Styling          | **Tailwind CSS**      |
| State Management | **React Context API** |

---

### ☁️ Cloud Services

| Service             | Provider                |
| ------------------- | ----------------------- |
| Backend Deployment  | **Render**              |
| Frontend Deployment | **Netlify**             |
| Database            | **PostgreSQL (Render)** |

---

📋 API Endpoints
🔑 Authentication Endpoints
|--------|----------------------|------------------------|---------------|
| Method | Endpoint             | Description            | Access        |
| ------ | -------------------- | ---------------------- | ------------- |
| POST   | `/api/auth/signup`   | User Registration      | **Public**    |
| POST   | `/api/auth/login`    | Login & Token Issuance | **Public**    |
| POST   | `/api/auth/validate` | Validate JWT Token     | **All Roles** |

---



📋 API Endpoints
🔑 Authentication Endpoints
Method	Endpoint	Description	Access
POST	/api/auth/signup	User Registration	Public
POST	/api/auth/login	Login & Token Issuance	Public
POST	/api/auth/validate	Validate JWT Token	All Roles
🏨 Hotel Endpoints
Method	Endpoint	Description	Access
GET	/api/hotels	Get all hotels	Public
GET	/api/hotels/{id}	Get hotel by ID	Public
GET	/api/hotels/search	Search hotels	Public
POST	/api/hotels	Create new hotel	Admin
PUT	/api/hotels/{id}	Update hotel	Admin
DELETE	/api/hotels/{id}	Delete hotel	Admin
🛏 Room Endpoints
Method	Endpoint	Description	Access
GET	/api/rooms/hotel/{hotelId}	Get rooms by hotel	Public
GET	/api/rooms/{id}	Get room by ID	Public
POST	/api/rooms	Create new room	Admin
PUT	/api/rooms/{id}	Update room	Admin
DELETE	/api/rooms/{id}	Delete room	Admin
📅 Booking Endpoints
Method	Endpoint	Description	Access
POST	/api/bookings	Create new booking	User
GET	/api/bookings/user	Get user bookings	User
GET	/api/bookings/{id}	Get booking by ID	User/Admin
PUT	/api/bookings/{id}/cancel	Cancel booking	User
GET	/api/bookings	Get all bookings	Admin
💳 Payment Endpoints
Method	Endpoint	Description	Access
POST	/api/payments/create-order	Create payment order	User
POST	/api/payments/verify	Verify payment	User
GET	/api/payments/booking/{bookingId}	Get payment by booking	User
🔍 Search Endpoints
Method	Endpoint	Description	Access
GET	/api/search/hotels	Search hotels by criteria	Public
GET	/api/search/availability	Check room availability	Public
