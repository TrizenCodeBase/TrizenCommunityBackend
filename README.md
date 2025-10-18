# Trizen Community Backend API

A comprehensive backend API for the Trizen Community Platform built with Node.js, Express, and MongoDB.

## 🚀 Features

### Core Features
- **User Authentication & Authorization**
  - JWT-based authentication
  - Email verification
  - Password reset functionality
  - Social login (Google, GitHub, LinkedIn)
  - Role-based access control (Admin, Moderator, User)

- **Event Management**
  - Create, read, update, delete events
  - Event registration system
  - Event categories and filtering
  - Event analytics and reporting
  - Email notifications for events

- **User Profiles**
  - Comprehensive user profiles
  - Avatar uploads
  - Skills and interests tracking
  - Activity monitoring
  - Privacy settings

- **Content Management**
  - Blog posts and articles
  - Resource library
  - Content categorization
  - Search functionality

- **Admin Dashboard**
  - User management
  - Event moderation
  - Analytics and reporting
  - System announcements
  - Content management

### Technical Features
- **Security**
  - Helmet.js for security headers
  - Rate limiting
  - Input validation and sanitization
  - XSS protection
  - CORS configuration

- **File Upload**
  - Cloudinary integration
  - Image optimization
  - Multiple file upload support
  - File type validation

- **Real-time Features**
  - Socket.IO integration
  - Real-time notifications
  - Live event updates

- **Email System**
  - Nodemailer integration
  - HTML email templates
  - Bulk email support
  - Event notifications

## 📋 Prerequisites

- Node.js (v18 or higher)
- MongoDB (v5 or higher)
- Cloudinary account (for image uploads)
- Email service (Gmail, SendGrid, etc.)

## 🛠 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   NODE_ENV=development
   PORT=5000
   HOST=localhost

   # Database
   MONGODB_URI=mongodb://localhost:27017/trizen_community

   # JWT
   JWT_SECRET=your_super_secret_jwt_key_here
   JWT_EXPIRE=7d

   # Email
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password

   # Cloudinary
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret

   # OAuth
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   GITHUB_CLIENT_ID=your_github_client_id
   GITHUB_CLIENT_SECRET=your_github_client_secret
   LINKEDIN_CLIENT_ID=your_linkedin_client_id
   LINKEDIN_CLIENT_SECRET=your_linkedin_client_secret

   # Frontend
   FRONTEND_URL=http://localhost:3000
   ```

4. **Start the server**
   ```bash
   # Development
   npm run dev

   # Production
   npm start
   ```

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "username": "johndoe"
}
```

#### Login User
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Current User
```http
GET /api/auth/me
Authorization: Bearer <token>
```

### Event Endpoints

#### Get All Events
```http
GET /api/events?page=1&limit=10&category=Workshop&search=AI
```

#### Get Single Event
```http
GET /api/events/:id
```

#### Create Event
```http
POST /api/events
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "AI Workshop",
  "description": "Learn AI fundamentals",
  "category": "Workshop",
  "type": "Online",
  "startDate": "2025-02-01T10:00:00Z",
  "endDate": "2025-02-01T12:00:00Z",
  "maxAttendees": 50,
  "price": 0
}
```

#### Register for Event
```http
POST /api/events/:id/register
Authorization: Bearer <token>
Content-Type: application/json

{
  "registrationData": {
    "dietaryRestrictions": "Vegetarian",
    "specialRequirements": "Wheelchair access"
  }
}
```

### User Endpoints

#### Get User Profile
```http
GET /api/users/:id
```

#### Update Profile
```http
PUT /api/users/:id
Authorization: Bearer <token>
Content-Type: application/json

{
  "bio": "Software developer passionate about AI",
  "skills": ["JavaScript", "Python", "React"],
  "location": "San Francisco, CA"
}
```

#### Search Users
```http
GET /api/users/search?q=developer&page=1&limit=10
```

### Upload Endpoints

#### Upload Avatar
```http
POST /api/upload/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: <file>
```

#### Upload Images
```http
POST /api/upload/images
Authorization: Bearer <token>
Content-Type: multipart/form-data

images: <files>
```

### Admin Endpoints

#### Get Dashboard Stats
```http
GET /api/admin/dashboard
Authorization: Bearer <admin-token>
```

#### Get All Users
```http
GET /api/admin/users?page=1&limit=20&search=john
Authorization: Bearer <admin-token>
```

#### Update User Status
```http
PUT /api/admin/users/:id/status
Authorization: Bearer <admin-token>
Content-Type: application/json

{
  "isActive": true,
  "isAdmin": false,
  "isModerator": true
}
```

## 🗄 Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  username: String (unique),
  avatar: String,
  bio: String,
  location: String,
  skills: [String],
  interests: [String],
  socialLinks: {
    linkedin: String,
    github: String,
    twitter: String
  },
  isEmailVerified: Boolean,
  isActive: Boolean,
  isAdmin: Boolean,
  isModerator: Boolean,
  preferences: {
    emailNotifications: Boolean,
    privacy: {
      profileVisibility: String,
      showEmail: Boolean,
      showLocation: Boolean
    }
  },
  stats: {
    eventsAttended: Number,
    eventsOrganized: Number,
    postsCreated: Number
  }
}
```

### Event Model
```javascript
{
  title: String,
  description: String,
  category: String,
  type: String,
  startDate: Date,
  endDate: Date,
  organizer: ObjectId (User),
  maxAttendees: Number,
  currentAttendees: Number,
  price: Number,
  status: String,
  isFeatured: Boolean,
  location: {
    venue: String,
    address: String,
    onlineLink: String
  },
  tags: [String],
  reviews: [{
    user: ObjectId,
    rating: Number,
    comment: String
  }]
}
```

## 🔒 Security Features

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input Validation**: Express-validator for request validation
- **Data Sanitization**: Protection against NoSQL injection and XSS
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **CORS**: Configurable cross-origin resource sharing
- **Helmet**: Security headers for protection

## 📧 Email Templates

The system includes pre-built email templates for:
- Email verification
- Password reset
- Event reminders
- Registration confirmations
- System announcements

## 🚀 Deployment

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/trizen_community
JWT_SECRET=your_production_jwt_secret
FRONTEND_URL=https://your-frontend-domain.com
```

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 API Response Format

All API responses follow this format:

```javascript
{
  "success": true,
  "message": "Operation successful",
  "data": {
    // Response data
  },
  "pagination": {
    // Pagination info (when applicable)
    "current": 1,
    "pages": 5,
    "total": 50,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support, email support@trizen.com or create an issue in the repository.
