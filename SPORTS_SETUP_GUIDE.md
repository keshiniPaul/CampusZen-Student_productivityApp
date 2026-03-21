# Sports Management System - Setup Guide

## 📋 Overview
Complete sports registration and management system for CampusZone with:
- ✅ 8 Pre-configured sports (Cricket, Volleyball, Netball, Badminton, Chess, Carrom, Table Tennis, Swimming)
- ✅ Automatic registration status tracking (OPEN/CLOSED/COMING SOON/FULL)
- ✅ Real-time notification system
- ✅ External registration link integration (Google Forms)
- ✅ Admin management features (add/edit/delete sports)
- ✅ Backend REST API with MongoDB
- ✅ Modern responsive UI

## 🚀 Quick Start

### 1. Backend Setup

#### Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows (if MongoDB is installed as a service)
net start MongoDB

# Or run mongod directly
mongod
```

#### Seed the Database
Navigate to the backend directory and run the seed script:
```bash
cd backend
npm run seed:sports
```

Expected output:
```
MongoDB connected successfully
Clearing existing sports data...
Seeding sports data...
✅ Successfully seeded 8 sports!

Created Sports:
- Cricket Team Selection (Team Selection)
- Volleyball Tournament (Tournament)
- Netball Team Trials (Team Selection)
- Badminton Championship (Tournament)
- Chess Tournament (Tournament)
- Carrom Championship (Tournament)
- Table Tennis Trials (Team Selection)
- Swimming Team Selection (Team Selection)
```

#### Start Backend Server
```bash
npm start
```

Backend will run on: `http://localhost:5000`

### 2. Frontend Setup

Navigate to the frontend directory:
```bash
cd frontend
npm start
```

Frontend will run on: `http://localhost:3000`

## 🎯 Accessing the Sports Page

1. Open your browser to `http://localhost:3000`
2. Navigate to Events Dashboard
3. Click on "Sports" category "View More" button
4. You'll be redirected to `/sports` showing all 8 sports programs

## 📡 API Endpoints

### Public Endpoints
- `GET /api/sports` - Get all sports
- `GET /api/sports/:id` - Get single sport by ID

### Student Endpoints (Authentication required)
- `POST /api/sports/:id/register` - Register for a sport

### Admin Endpoints (Admin authentication required)
- `POST /api/sports` - Create new sport
- `PUT /api/sports/:id` - Update sport
- `DELETE /api/sports/:id` - Delete sport (soft delete)
- `POST /api/sports/:id/notify` - Send notification

### Example API Request

**Get all sports:**
```javascript
fetch('http://localhost:5000/api/sports')
  .then(response => response.json())
  .then(data => console.log(data));
```

**Get sports by category:**
```javascript
fetch('http://localhost:5000/api/sports?category=Tournament')
  .then(response => response.json())
  .then(data => console.log(data));
```

## 🔑 Key Features

### Registration Status System
The system automatically calculates registration status based on dates:
- **COMING SOON** (Yellow) - Before registration opens
- **OPEN** (Green, pulsing animation) - During registration period
- **FULL** (Orange) - Capacity reached
- **CLOSED** (Red) - After registration closes

### Notification System
Automatic alerts are generated for:
- Registration opens today
- 2 days before closing
- Last day to register
- Registration closed

### Sports Details Modal
Click "View Details" on any sport to see:
- Full description
- Coach/Instructor information
- Venue details
- Registration capacity with progress bar
- Eligibility requirements
- Selection criteria
- Skill levels accepted
- Medical certificate requirements (if applicable)
- Registration open/close dates

### External Registration
Click "Register Now" to open the sport's Google Forms registration link in a new tab.

## 📊 Database Schema

### Sport Model
```javascript
{
  name: String (required),
  category: String (enum: ["Team Selection", "Tournament"]),
  description: String (required),
  registrationOpen: Date (required),
  registrationClose: Date (required),
  venue: String (required),
  coach: String (required),
  maxCapacity: Number (required, min: 1),
  registered: Number (default: 0),
  eligibility: String (required),
  selectionCriteria: String (required),
  requiresMedical: Boolean (default: false),
  skillLevels: [String] (enum: ["Beginner", "Intermediate", "Advanced"]),
  registrationLink: String (required),
  isActive: Boolean (default: true),
  createdBy: ObjectId (ref: "User"),
  timestamps: true
}
```

## 🎨 UI Components

### Sports Page Components
- **Header** - Navigation with notification bell and profile dropdown
- **Alert Banner** - Shows active notifications count
- **Sports Grid** - Responsive card layout for all sports
- **Sports Card** - Shows status badge, capacity, registration dates, and actions
- **Details Modal** - Full sport information with registration link
- **Notifications Dropdown** - Real-time alerts for all sports
- **Footer** - Calendar widget and social links

### Responsive Design
- Desktop: Multi-column grid layout
- Tablet: 2-column layout
- Mobile: Single column layout

## 🛠️ Tech Stack

### Frontend
- React 18+ with Hooks
- React Router DOM v6
- CSS Modules with modern features
- Date-based business logic

### Backend
- Node.js with Express
- MongoDB with Mongoose
- RESTful API architecture
- Soft delete for data integrity

## 🔄 Environment Variables

Create `.env` file in backend directory:
```env
MONGO_URI=mongodb://127.0.0.1:27017/campuszone
PORT=5000
```

Create `.env` file in frontend directory:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

## 📝 Sample Sports Data

The seed script includes 8 pre-configured sports with realistic data:

1. **Cricket Team Selection** - Team trials for university cricket team
2. **Volleyball Tournament** - Inter-batch volleyball competition
3. **Netball Team Trials** - Female-only netball team selection
4. **Badminton Championship** - Singles and doubles tournament
5. **Chess Tournament** - Strategic chess competition
6. **Carrom Championship** - Indoor carrom tournament
7. **Table Tennis Trials** - University table tennis team selection
8. **Swimming Team Selection** - Competitive swimming team (requires certification)

## 🚧 Future Enhancements

### Pending Features (Not yet implemented)
- [ ] Admin sports management UI (add/edit/delete from frontend)
- [ ] Student dashboard "My Sports" section
- [ ] Skill level selection during registration
- [ ] Document upload for medical certificates
- [ ] Attendance tracking system
- [ ] Selection results announcement
- [ ] Email notifications integration
- [ ] Student registration history
- [ ] Admin approval/rejection workflow
- [ ] Real-time capacity updates

## 📖 Usage Examples

### For Students
1. Browse available sports programs
2. Check registration status and dates
3. View detailed information about each sport
4. Click "Register Now" to fill external form
5. Check notifications for important updates

### For Admins (Backend API)
```javascript
// Create new sport
const newSport = {
  name: "Basketball Championship",
  category: "Tournament",
  description: "Inter-batch basketball tournament",
  registrationOpen: "2026-04-01",
  registrationClose: "2026-04-30",
  venue: "Basketball Court",
  coach: "Coach John Doe",
  maxCapacity: 80,
  eligibility: "All students",
  selectionCriteria: "Team-based tournament",
  requiresMedical: false,
  skillLevels: ["Beginner", "Intermediate", "Advanced"],
  registrationLink: "https://forms.gle/basketball-registration"
};

fetch('http://localhost:5000/api/sports', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer YOUR_ADMIN_TOKEN'
  },
  body: JSON.stringify(newSport)
});
```

## 🐛 Troubleshooting

### Backend Issues

**MongoDB Connection Error:**
- Ensure MongoDB is running
- Check MONGO_URI in .env file
- Verify MongoDB service is started

**Port Already in Use:**
- Change PORT in .env file
- Kill process using port 5000

### Frontend Issues

**API Connection Error:**
- Verify backend is running on port 5000
- Check REACT_APP_API_URL in .env
- Check browser console for CORS errors

**Sports Not Loading:**
- Check if database is seeded
- Verify API endpoint is accessible
- Check browser Network tab for API calls

### Seed Script Issues

**Duplicate Key Error:**
- Database already seeded
- Run seed:sports again to clear and re-seed

## 📞 Support

If you encounter any issues:
1. Check the console logs (both frontend and backend)
2. Verify MongoDB connection
3. Ensure all dependencies are installed (`npm install`)
4. Check if ports 3000 and 5000 are available

## ✅ Checklist

Before running the application:
- [ ] MongoDB installed and running
- [ ] Backend dependencies installed (`npm install` in backend/)
- [ ] Frontend dependencies installed (`npm install` in frontend/)
- [ ] Database seeded (`npm run seed:sports`)
- [ ] Backend server running (`npm start` in backend/)
- [ ] Frontend server running (`npm start` in frontend/)
- [ ] Environment variables configured

## 🎉 Success!

If everything is set up correctly, you should see:
- 8 sports displayed on the Sports page
- Status badges showing current registration status
- Notifications in the header bell icon
- Clickable "View Details" and "Register Now" buttons
- Smooth animations and responsive design

Enjoy your new Sports Management System! 🏆
