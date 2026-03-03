const mongoose = require("mongoose");
const Club = require("./models/clubmodel");
const connectDB = require("./config/db");

// Connect to database
connectDB();

// Sample clubs data
const sampleClubs = [
  {
    name: "IEEE Student Branch",
    category: "Technical",
    description: "Institute of Electrical and Electronics Engineers (IEEE) is the world's largest technical professional organization dedicated to advancing technology for the benefit of humanity. Join us to enhance your technical skills, network with professionals, and participate in cutting-edge projects.",
    vision: "To be a leading technical community that inspires innovation, fosters technical excellence, and prepares students for successful careers in technology and engineering fields.",
    mission: "Empower students through technical workshops, industry connections, innovation challenges, and professional development opportunities that bridge the gap between academic learning and industry requirements.",
    registrationOpen: new Date("2024-01-15"),
    registrationClose: new Date("2024-02-15"),
    president: "Kavindu Perera",
    advisor: "Dr. Nimal Silva",
    maxMembers: 100,
    currentMembers: 0,
    members: [],
    upcomingEvents: [
      { name: "Arduino Workshop", date: new Date("2024-02-20") },
      { name: "Web Development Bootcamp", date: new Date("2024-03-05") },
      { name: "IEEE Day Celebration", date: new Date("2024-10-01") }
    ],
    socialMedia: {
      facebook: "https://facebook.com/ieee-student-branch",
      instagram: "https://instagram.com/ieee_student_branch",
      linkedin: "https://linkedin.com/company/ieee-student-branch"
    },
    registrationFormLink: "https://forms.gle/ieee-registration",
    announcements: []
  },
  {
    name: "Leo Club",
    category: "Social Service",
    description: "Leo Club is a youth organization sponsored by Lions Club International. We focus on community service, leadership development, and social responsibility. Be part of a global network that makes a positive impact in society through various humanitarian projects.",
    vision: "To create compassionate leaders who actively contribute to solving community challenges and building a better world through service.",
    mission: "Engage students in meaningful community service projects, develop leadership and organizational skills, and promote social awareness while making lasting friendships.",
    registrationOpen: new Date("2024-01-10"),
    registrationClose: new Date("2024-02-10"),
    president: "Nethmi Fernando",
    advisor: "Ms. Sanduni Jayawardena",
    maxMembers: 80,
    currentMembers: 0,
    members: [],
    upcomingEvents: [
      { name: "Blood Donation Campaign", date: new Date("2024-02-25") },
      { name: "Environmental Cleanup Drive", date: new Date("2024-03-10") },
      { name: "Children's Home Visit", date: new Date("2024-03-20") }
    ],
    socialMedia: {
      facebook: "https://facebook.com/leo-club",
      instagram: "https://instagram.com/leo_club_official",
      linkedin: "https://linkedin.com/company/leo-club"
    },
    registrationFormLink: "https://forms.gle/leo-club-registration",
    announcements: []
  },
  {
    name: "AIESEC",
    category: "Professional",
    description: "AIESEC is the world's largest youth-run organization focused on developing leadership through international exchanges and professional experiences. Access global opportunities, develop cross-cultural understanding, and enhance your employability through international internships and volunteer programs.",
    vision: "To develop socially responsible leaders who create positive impact through international experiences and cross-cultural collaboration.",
    mission: "Provide students with international exchange opportunities, professional development programs, and leadership training that prepare them for global careers and responsible citizenship.",
    registrationOpen: new Date("2024-01-20"),
    registrationClose: new Date("2024-02-20"),
    president: "Tharindu Wickramasinghe",
    advisor: "Mr. Chaminda Rathnayake",
    maxMembers: 60,
    currentMembers: 0,
    members: [],
    upcomingEvents: [
      { name: "Global Talent Info Session", date: new Date("2024-02-28") },
      { name: "Leadership Development Workshop", date: new Date("2024-03-12") },
      { name: "International Exchange Fair", date: new Date("2024-04-05") }
    ],
    socialMedia: {
      facebook: "https://facebook.com/aiesec",
      instagram: "https://instagram.com/aiesec_official",
      linkedin: "https://linkedin.com/company/aiesec"
    },
    registrationFormLink: "https://forms.gle/aiesec-registration",
    announcements: []
  },
  {
    name: "Students Interactive Society",
    category: "Cultural",
    description: "Students Interactive Society (SIS) is dedicated to promoting cultural diversity, artistic expression, and social interaction among students. Participate in cultural events, talent shows, workshops, and networking sessions that celebrate creativity and build lasting friendships.",
    vision: "To create an inclusive community where students celebrate diversity, express creativity, and build meaningful connections through cultural and social activities.",
    mission: "Organize engaging cultural events, talent showcases, and social gatherings that promote artistic expression, cultural awareness, and student wellbeing.",
    registrationOpen: new Date("2024-01-05"),
    registrationClose: new Date("2024-02-05"),
    president: "Dinushi Amarasena",
    advisor: "Ms. Priyanka Wickramaratne",
    maxMembers: 120,
    currentMembers: 0,
    members: [],
    upcomingEvents: [
      { name: "Talent Show Auditions", date: new Date("2024-02-22") },
      { name: "Cultural Night", date: new Date("2024-03-15") },
      { name: "Photography Exhibition", date: new Date("2024-04-10") }
    ],
    socialMedia: {
      facebook: "https://facebook.com/students-interactive-society",
      instagram: "https://instagram.com/sis_official",
      linkedin: "https://linkedin.com/company/students-interactive-society"
    },
    registrationFormLink: "https://forms.gle/sis-registration",
    announcements: []
  },
  {
    name: "Media Unit",
    category: "Creative",
    description: "Media Unit is the creative hub for all campus media-related activities including photography, videography, graphic design, and content creation. Join us to develop your creative skills, cover campus events, and build an impressive portfolio.",
    vision: "To be the premier student-run media organization that captures campus life through innovative storytelling and professional content creation.",
    mission: "Train students in media production, document campus activities through high-quality content, and provide a platform for creative expression and skill development in digital media.",
    registrationOpen: new Date("2024-01-25"),
    registrationClose: new Date("2024-02-25"),
    president: "Hasitha Rajapaksha",
    advisor: "Mr. Nuwan Bandara",
    maxMembers: 50,
    currentMembers: 0,
    members: [],
    upcomingEvents: [
      { name: "Photography Basics Workshop", date: new Date("2024-03-01") },
      { name: "Video Editing Masterclass", date: new Date("2024-03-18") },
      { name: "Campus Documentary Screening", date: new Date("2024-04-15") }
    ],
    socialMedia: {
      facebook: "https://facebook.com/media-unit",
      instagram: "https://instagram.com/media_unit_official",
      linkedin: "https://linkedin.com/company/media-unit"
    },
    registrationFormLink: "https://forms.gle/media-unit-registration",
    announcements: []
  },
  {
    name: "Student Community",
    category: "Community",
    description: "Student Community is the central organization that represents all students and coordinates various campus-wide initiatives. We focus on student welfare, peer support, academic guidance, and creating a supportive campus environment for everyone.",
    vision: "To build a unified student body where every member feels valued, supported, and empowered to contribute to campus life and personal growth.",
    mission: "Advocate for student rights and welfare, organize peer mentoring programs, facilitate academic support, and create an inclusive community that enhances the overall student experience.",
    registrationOpen: new Date("2024-01-08"),
    registrationClose: new Date("2024-02-08"),
    president: "Chanuka Dissanayake",
    advisor: "Dr. Samantha Gunasekara",
    maxMembers: 150,
    currentMembers: 0,
    members: [],
    upcomingEvents: [
      { name: "Freshers' Welcome Program", date: new Date("2024-02-18") },
      { name: "Peer Mentoring Session", date: new Date("2024-03-08") },
      { name: "Student Welfare Fair", date: new Date("2024-04-20") }
    ],
    socialMedia: {
      facebook: "https://facebook.com/student-community",
      instagram: "https://instagram.com/student_community_official",
      linkedin: "https://linkedin.com/company/student-community"
    },
    registrationFormLink: "https://forms.gle/student-community-registration",
    announcements: []
  }
];

// Seed function
const seedClubs = async () => {
  try {
    // Delete all existing clubs
    await Club.deleteMany({});
    console.log("Existing clubs deleted");

    // Insert sample clubs
    const clubs = await Club.insertMany(sampleClubs);
    console.log(`${clubs.length} clubs inserted successfully`);
    console.log("Clubs seeded:");
    clubs.forEach(club => {
      console.log(`- ${club.name} (${club.category}) - Status: ${club.status}`);
    });

    process.exit(0);
  } catch (error) {
    console.error("Error seeding clubs:", error);
    process.exit(1);
  }
};

// Run seed function
seedClubs();
