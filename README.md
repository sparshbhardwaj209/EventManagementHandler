# 🎉 Event Management Platform

![Banner](https://github.com/user-attachments/assets/46907101-a18a-4039-8b03-83d506d2837b)

Welcome to the **Event Management Platform**! This full-stack web application allows users to create, view, and manage events with real-time updates. With robust user authentication (including guest login), real-time attendee tracking via Socket.IO, and Cloudinary image integration, this project is designed to provide an intuitive experience for both organizers and attendees.

---

## 🚀 Features

### Frontend
- **User Authentication:**  
  - Register, login, and guest login options using JWT.  
  - Seamless session persistence across page refreshes.
- **Event Dashboard:**  
  - View a list of upcoming, past, and recently added events.  
  - Filter events by date, status (upcoming/past), or recent additions.
- **Event Creation:**  
  - Create new events with details such as name, description, date/time, location, and an optional image upload (hosted on Cloudinary).  
  - Only registered (non-guest) users can create events.
- **Real-Time Attendee Tracking:**  
  - Attend/Withdraw from events with real-time updates across all connected clients using Socket.IO.
- **Responsive Design:**  
  - Optimized for mobile, tablet, and desktop viewing.
- **User Experience:**  
  - Attractive, clean UI with intuitive navigation and interactive filtering options.  
  - Emojis and animations to enhance user engagement.

### Backend
- **Authentication API:**  
  - Secure endpoints for user registration, login, and guest login with JWT-based authentication.
- **Event Management API:**  
  - CRUD operations for events with ownership restrictions (only the event creator can delete events).  
  - Optional image hosting using Cloudinary (upload size capped at 500KB).
- **Real-Time Updates:**  
  - Uses Socket.IO to broadcast attendee changes in real time.
- **Database:**  
  - Utilizes MongoDB with Mongoose for efficient data storage and querying.

---

## 🛠️ Technologies Used

- **Frontend:**  
  - React, React Router  
  - Axios for HTTP requests  
  - Socket.IO client  
  - Plain CSS (custom styles)

- **Backend:**  
  - Node.js, Express  
  - MongoDB, Mongoose  
  - JWT for authentication  
  - Socket.IO for real-time updates  
  - Multer for handling file uploads  
  - Cloudinary for image hosting  
  - dotenv for environment variable management

---

### Prerequisites
- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (or use MongoDB Atlas)
- [Git](https://git-scm.com/)


## 📥 Installation

### Clone the Repository

```bash
git clone https://github.com/yourusername/event-management-platform.git
cd event-management-platform
```

### Backend Setup
1. **Navigate to the backend folder** (if separate):

   ```bash
   cd event-backend
   ```

2. **Install dependencies:**

   ```bash
   npm install
    ```

3. **Create a .env file in the root of the backend with the following variables:**
    ```bash
    PORT=5000
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
    CLOUDINARY_API_KEY=your_cloudinary_api_key
    CLOUDINARY_API_SECRET=your_cloudinary_api_secret
    CLIENT_URL=http://localhost:3000
    ```

4. **Start the backend server:**
     ```bash
       npm run dev
      ```

### Frontend Setup

1. **Navigate to the frontend folder:**
   ```bash
     cd ../event-frontend
    ```

2. **Install dependencies:**
     ```bash
     npm install
      ```

3. **Create a .env file in the root of the frontend with:**
    ```bash
      REACT_APP_API_URL=http://localhost:5000
    ```

4. **Start the frontend development server:**
   ```bash
   npm start
    ```

   
