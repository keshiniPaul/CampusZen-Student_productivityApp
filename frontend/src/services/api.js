// API base URL - update this based on your backend server
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Sport API endpoints
export const sportsAPI = {
  // Get all sports
  getAllSports: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/sports${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sports');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching sports:', error);
      throw error;
    }
  },

  // Get single sport by ID
  getSportById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch sport');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching sport:', error);
      throw error;
    }
  },

  // Create new sport (Admin only)
  createSport: async (sportData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sportData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create sport');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating sport:', error);
      throw error;
    }
  },

  // Update sport (Admin only)
  updateSport: async (id, sportData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(sportData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update sport');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating sport:', error);
      throw error;
    }
  },

  // Delete sport (Admin only)
  deleteSport: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete sport');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting sport:', error);
      throw error;
    }
  },

  // Register for sport (Student only)
  registerForSport: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/${id}/register`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to register for sport');
      }
      
      return data;
    } catch (error) {
      console.error('Error registering for sport:', error);
      throw error;
    }
  },

  // Send notification (Admin only)
  sendNotification: async (id, notificationData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/sports/${id}/notify`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to send notification');
      }
      
      return data;
    } catch (error) {
      console.error('Error sending notification:', error);
      throw error;
    }
  },
};

// Event API endpoints (for existing event management)
export const eventAPI = {
  // Get all events
  getAllEvents: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/events${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch events');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching events:', error);
      throw error;
    }
  },

  // Create new event (Admin only)
  createEvent: async (eventData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create event');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating event:', error);
      throw error;
    }
  },

  // Update event (Admin only)
  updateEvent: async (id, eventData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update event');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating event:', error);
      throw error;
    }
  },

  // Delete event (Admin only)
  deleteEvent: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete event');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting event:', error);
      throw error;
    }
  },
};

// Club API endpoints
export const clubsAPI = {
  // Get all clubs
  getAllClubs: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/clubs${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch clubs');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching clubs:', error);
      throw error;
    }
  },

  // Get single club by ID
  getClubById: async (id) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch club');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching club:', error);
      throw error;
    }
  },

  // Create new club (Admin only)
  createClub: async (clubData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clubData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create club');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating club:', error);
      throw error;
    }
  },

  // Update club (Admin/President only)
  updateClub: async (id, clubData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(clubData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update club');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating club:', error);
      throw error;
    }
  },

  // Delete club (Admin only)
  deleteClub: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete club');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting club:', error);
      throw error;
    }
  },

  // Join club (Student only)
  joinClub: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}/join`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to join club');
      }
      
      return data;
    } catch (error) {
      console.error('Error joining club:', error);
      throw error;
    }
  },

  // Manage member (Approve/Reject) (Admin/President only)
  manageMember: async (clubId, memberId, action, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${clubId}/members/${memberId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ action }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to manage member');
      }
      
      return data;
    } catch (error) {
      console.error('Error managing member:', error);
      throw error;
    }
  },

  // Post announcement (Admin/President only)
  postAnnouncement: async (id, announcementData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/clubs/${id}/announcements`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(announcementData),
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to post announcement');
      }
      
      return data;
    } catch (error) {
      console.error('Error posting announcement:', error);
      throw error;
    }
  },
};

// Career API endpoints
export const careerAPI = {
  // Get all careers
  getAllCareers: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/careers`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch careers');
      }
      
      return data;
    } catch (error) {
      console.error('Error fetching careers:', error);
      throw error;
    }
  },

  // Create new career (Admin only)
  createCareer: async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/careers`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData handles its own headers
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to create career');
      }
      
      return data;
    } catch (error) {
      console.error('Error creating career:', error);
      throw error;
    }
  },

  // Update career (Admin only)
  updateCareer: async (id, formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData, // FormData handles its own headers
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to update career');
      }
      
      return data;
    } catch (error) {
      console.error('Error updating career:', error);
      throw error;
    }
  },

  // Delete career (Admin only)
  deleteCareer: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/careers/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete career');
      }
      
      return data;
    } catch (error) {
      console.error('Error deleting career:', error);
      throw error;
    }
  },
};

// Internship Application API endpoints
export const internshipAPI = {
  // Get all applications for current user
  getAllApplications: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/internships`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch applications');
      return data;
    } catch (error) {
      console.error('Error fetching internship applications:', error);
      throw error;
    }
  },

  // Get single application by ID
  getApplicationById: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch application');
      return data;
    } catch (error) {
      console.error('Error fetching internship application:', error);
      throw error;
    }
  },

  // Create new application
  createApplication: async (applicationData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/internships`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create application');
      return data;
    } catch (error) {
      console.error('Error creating internship application:', error);
      throw error;
    }
  },

  // Update application
  updateApplication: async (id, applicationData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(applicationData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update application');
      return data;
    } catch (error) {
      console.error('Error updating internship application:', error);
      throw error;
    }
  },

  // Delete application
  deleteApplication: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/internships/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete application');
      return data;
    } catch (error) {
      console.error('Error deleting internship application:', error);
      throw error;
    }
  },
};

// Notification API endpoints
export const notificationAPI = {
  // Create notification
  createNotification: async (notificationData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(notificationData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create notification');
      return data;
    } catch (error) {
      console.error('Error creating notification:', error);
      throw error;
    }
  },

  // Get all notifications for current user
  getAllNotifications: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch notifications');
      return data;
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  },

  // Mark notification as read
  markAsRead: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to mark notification as read');
      return data;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      throw error;
    }
  },

  // Delete notification
  deleteNotification: async (id, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/notifications/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete notification');
      return data;
    } catch (error) {
      console.error('Error deleting notification:', error);
      throw error;
    }
  },
};

const api = { sportsAPI, eventAPI, clubsAPI, careerAPI, internshipAPI, notificationAPI };


export default api;
