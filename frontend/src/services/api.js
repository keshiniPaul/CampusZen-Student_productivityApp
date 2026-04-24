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

// Study Group API endpoints
export const studyGroupsAPI = {
  // Get all study groups
  getAllGroups: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/study-groups${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch study groups');
      return data;
    } catch (error) {
      console.error('Error fetching study groups:', error);
      throw error;
    }
  },

  // Get single group by ID
  getGroupById: async (groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/study-groups/${groupId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch study group');
      return data;
    } catch (error) {
      console.error('Error fetching study group:', error);
      throw error;
    }
  },

  // Create a new study group
  createGroup: async (groupData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/study-groups`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(groupData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create study group');
      return data;
    } catch (error) {
      console.error('Error creating study group:', error);
      throw error;
    }
  },

  // Join a study group
  joinGroup: async (groupId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/study-groups/${groupId}/members`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to join study group');
      return data;
    } catch (error) {
      console.error('Error joining study group:', error);
      throw error;
    }
  },

  // Leave a study group
  leaveGroup: async (groupId, userId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/study-groups/${groupId}/members/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to leave study group');
      return data;
    } catch (error) {
      console.error('Error leaving study group:', error);
      throw error;
    }
  },

  // Get group members
  getGroupMembers: async (groupId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/study-groups/${groupId}/members`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch members');
      return data;
    } catch (error) {
      console.error('Error fetching group members:', error);
      throw error;
    }
  },
};

// Resources API endpoints
export const resourcesAPI = {
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/resources${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch resources');
      return data;
    } catch (error) {
      console.error('Error fetching resources:', error);
      throw error;
    }
  },

  getById: async (resourceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch resource');
      return data;
    } catch (error) {
      console.error('Error fetching resource:', error);
      throw error;
    }
  },

  upload: async (formData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to upload resource');
      return data;
    } catch (error) {
      console.error('Error uploading resource:', error);
      throw error;
    }
  },

  delete: async (resourceId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${resourceId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete resource');
      return data;
    } catch (error) {
      console.error('Error deleting resource:', error);
      throw error;
    }
  },

  incrementDownload: async (resourceId) => {
    try {
      const response = await fetch(`${API_BASE_URL}/resources/${resourceId}/download`, { method: 'PATCH' });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update download count');
      return data;
    } catch (error) {
      console.error('Error updating download count:', error);
      throw error;
    }
  },
};

// Assignments API endpoints
export const assignmentsAPI = {
  getAll: async (params = {}) => {
    try {
      const queryString = new URLSearchParams(params).toString();
      const url = `${API_BASE_URL}/assignments${queryString ? `?${queryString}` : ''}`;
      const response = await fetch(url);
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch assignments');
      return data;
    } catch (error) {
      console.error('Error fetching assignments:', error);
      throw error;
    }
  },

  create: async (assignmentData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(assignmentData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create assignment');
      return data;
    } catch (error) {
      console.error('Error creating assignment:', error);
      throw error;
    }
  },

  updateStatus: async (assignmentId, status, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update status');
      return data;
    } catch (error) {
      console.error('Error updating assignment status:', error);
      throw error;
    }
  },

  update: async (assignmentId, assignmentData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(assignmentData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update assignment');
      return data;
    } catch (error) {
      console.error('Error updating assignment:', error);
      throw error;
    }
  },

  delete: async (assignmentId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/assignments/${assignmentId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete assignment');
      return data;
    } catch (error) {
      console.error('Error deleting assignment:', error);
      throw error;
    }
  },
};

// Timetable API endpoints
export const timetableAPI = {
  getAll: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to fetch timetable');
      return data;
    } catch (error) {
      console.error('Error fetching timetable:', error);
      throw error;
    }
  },

  create: async (slotData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(slotData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to create slot');
      return data;
    } catch (error) {
      console.error('Error creating timetable slot:', error);
      throw error;
    }
  },

  update: async (slotId, slotData, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/${slotId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(slotData),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to update slot');
      return data;
    } catch (error) {
      console.error('Error updating timetable slot:', error);
      throw error;
    }
  },

  delete: async (slotId, token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/timetable/${slotId}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Failed to delete slot');
      return data;
    } catch (error) {
      console.error('Error deleting timetable slot:', error);
      throw error;
    }
  },
};

const api = { sportsAPI, eventAPI, clubsAPI, studyGroupsAPI, resourcesAPI, assignmentsAPI, timetableAPI };

export default api;
