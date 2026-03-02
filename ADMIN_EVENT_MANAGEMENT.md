# Admin Event Management System

## Overview
Complete admin event management system with role-based access control, allowing administrators to add, edit, and delete events while preventing students from making changes.

## Features Implemented

### 1. **Role-Based Access Control**
   - Admin users can add, edit, and delete events
   - Student users can only view events
   - Role is controlled by `isAdmin` state variable in Event.js (line 82)
   - Set `isAdmin` to `true` for admin access, `false` for student access

### 2. **Add Event (Admin Only)**
   - Click "+ Add Event" button in the header (only visible to admins)
   - Fill in the event form with:
     - Event Title *required*
     - Description *required*
     - Category (Event/Activity/Community)
     - Date *required*
     - Venue *required*
     - Image selection
   - Submit to add the event to the list

### 3. **Edit Event (Admin Only)**
   - Click the edit button (pencil icon) on any event card
   - Modify event details in the modal form
   - Submit to update the event

### 4. **Delete Event (Admin Only)**
   - Click the delete button (trash icon) on any event card
   - Confirm deletion in the popup modal
   - Event is removed from the list

### 5. **Notifications for Non-Admin Actions**
   - If a student tries to add/edit/delete events, they receive an alert
   - "Only administrators can add/edit/delete events"

## Frontend Files Modified

### Event.js (`frontend/src/pages/Event.js`)
- Added state management for events, modal, forms, and admin role
- Implemented CRUD operation handlers:
  - `handleAddEvent()` - Opens modal for new event
  - `handleEditEvent(event)` - Opens modal with event data
  - `handleDeleteEvent(eventId)` - Shows delete confirmation
  - `handleSubmitEvent(e)` - Saves new/edited event
  - `confirmDelete()` - Removes event from list
- Added event form modal with validation
- Added delete confirmation modal
- Added admin action buttons on event cards

### Event.css (`frontend/src/pages/Event.css`)
- Styled "+ Add Event" button with gradient and hover effects
- Added admin action buttons (edit/delete) styling
- Created modal overlay and content styles
- Styled form inputs, labels, and groups
- Added responsive design for mobile devices
- Implemented animations (fadeIn, slideUp, pulse)

## Backend API Implementation

### New Files Created:

1. **eventmodel.js** (`backend/models/eventmodel.js`)
   - MongoDB schema for events
   - Fields: title, description, category, date, venue, image, createdBy, isActive
   - Includes timestamps and indexes

2. **eventcontrollers.js** (`backend/controllers/eventcontrollers.js`)
   - `getEvents()` - GET all events with filters
   - `getEventById()` - GET single event
   - `createEvent()` - POST new event (admin only)
   - `updateEvent()` - PUT update event (admin only)
   - `deleteEvent()` - DELETE event (admin only, soft delete)

3. **eventroutes.js** (`backend/routes/eventroutes.js`)
   - Public routes: GET /api/events, GET /api/events/:id
   - Admin routes: POST /api/events, PUT /api/events/:id, DELETE /api/events/:id

4. **authMiddleware.js** (`backend/middleware/authMiddleware.js`)
   - `protect()` - JWT authentication middleware (placeholder)
   - `adminOnly()` - Admin authorization middleware (placeholder)

### Updated Files:

5. **app.js** (`backend/app.js`)
   - Added event routes: `/api/events`

## Testing Instructions

### To Test Admin Features:

1. **Set Admin Role**
   ```javascript
   // In Event.js, line 82
   const [isAdmin, setIsAdmin] = useState(true); // Admin access
   ```

2. **Add Event**
   - Click "+ Add Event" button
   - Fill in all required fields
   - Click "Add Event" to submit
   - Event appears in the grid

3. **Edit Event**
   - Click pencil icon on any event card
   - Modify fields in the form
   - Click "Update Event" to save
   - Changes reflect immediately

4. **Delete Event**
   - Click trash icon on any event card
   - Click "Delete Event" in confirmation
   - Event is removed from the grid

### To Test Student Access:

1. **Set Student Role**
   ```javascript
   // In Event.js, line 82
   const [isAdmin, setIsAdmin] = useState(false); // Student access
   ```

2. **Verify Restrictions**
   - "+ Add Event" button is hidden
   - Edit/Delete buttons don't appear on event cards
   - Students can only view events

## Backend API Endpoints

### GET /api/events
- **Description**: Get all active events
- **Query Parameters**: 
  - `category` - Filter by Event/Activity/Community
  - `startDate` - Filter events from date
  - `endDate` - Filter events until date
- **Response**: List of events

### GET /api/events/:id
- **Description**: Get single event by ID
- **Response**: Event details

### POST /api/events (Admin Only)
- **Description**: Create new event
- **Body**: 
  ```json
  {
    "title": "Event Title",
    "shortDescription": "Description",
    "category": "Event",
    "date": "2026-03-22",
    "venue": "Location",
    "image": "image.png"
  }
  ```
- **Response**: Created event

### PUT /api/events/:id (Admin Only)
- **Description**: Update existing event
- **Body**: Same as POST (all fields optional)
- **Response**: Updated event

### DELETE /api/events/:id (Admin Only)
- **Description**: Delete event (soft delete)
- **Response**: Success message

## Future Enhancements

1. **Implement JWT Authentication**
   - Complete the `protect()` and `adminOnly()` middleware
   - Add user login/registration system
   - Store JWT tokens securely

2. **Connect Frontend to Backend**
   - Replace local state with API calls
   - Use fetch/axios to communicate with backend
   - Handle loading states and errors

3. **Image Upload**
   - Implement file upload functionality
   - Store images on server or cloud storage
   - Display uploaded images on event cards

4. **Advanced Features**
   - Event search and filtering
   - Event calendar view
   - Event registration tracking
   - Email notifications
   - Event analytics dashboard

## Security Notes

- Currently, the admin role is set in frontend state (demo purposes)
- In production, admin role should be verified on backend
- Implement proper JWT authentication before deployment
- Validate all inputs on backend
- Sanitize user data to prevent XSS attacks
- Use HTTPS in production

## Styling Details

- Modern glassmorphism effects
- Smooth animations and transitions
- Responsive design for all screen sizes
- Accessible with ARIA labels
- Consistent color scheme (blue primary, red for delete)
- Professional gradient buttons

## Dependencies

No additional npm packages required for the current implementation. For production:
- Backend: `mongoose`, `jsonwebtoken`, `bcryptjs`
- Frontend: `axios` or `fetch` for API calls

---

**Created**: March 2, 2026  
**Version**: 1.0.0
