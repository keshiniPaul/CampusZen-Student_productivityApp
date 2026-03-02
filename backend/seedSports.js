const mongoose = require("mongoose");
const Sport = require("./models/sportmodel");
require("dotenv").config();

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI ||  "mongodb://127.0.0.1:27017/campuszone");
    console.log("MongoDB connected successfully");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    process.exit(1);
  }
};

// Sample sports data
const sportsData = [
  {
    name: "Cricket Team Selection",
    category: "Team Selection",
    description: "Join the university cricket team and represent us in inter-university tournaments.",
    registrationOpen: new Date("2026-03-01"),
    registrationClose: new Date("2026-03-25"),
    venue: "Cricket Ground",
    coach: "Coach Rajitha Silva",
    maxCapacity: 100,
    registered: 45,
    eligibility: "All students with basic cricket knowledge",
    selectionCriteria: "Batting, Bowling, Fielding skills assessment",
    requiresMedical: true,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/cricket-registration",
  },
  {
    name: "Volleyball Tournament",
    category: "Tournament",
    description: "Compete in the annual inter-batch volleyball tournament.",
    registrationOpen: new Date("2026-03-05"),
    registrationClose: new Date("2026-03-30"),
    venue: "Indoor Sports Complex",
    coach: "Coach Nimal Fernando",
    maxCapacity: 80,
    registered: 62,
    eligibility: "All students",
    selectionCriteria: "Team formation and skill assessment",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/volleyball-registration",
  },
  {
    name: "Netball Team Trials",
    category: "Team Selection",
    description: "Try out for the university netball team.",
    registrationOpen: new Date("2026-03-10"),
    registrationClose: new Date("2026-04-05"),
    venue: "Netball Court",
    coach: "Coach Sanduni Perera",
    maxCapacity: 60,
    registered: 38,
    eligibility: "Female students only",
    selectionCriteria: "Agility, teamwork, and game knowledge",
    requiresMedical: true,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/netball-registration",
  },
  {
    name: "Badminton Championship",
    category: "Tournament",
    description: "Annual badminton singles and doubles championship.",
    registrationOpen: new Date("2026-02-25"),
    registrationClose: new Date("2026-03-20"),
    venue: "Indoor Sports Hall",
    coach: "Coach Kasun Jayawardena",
    maxCapacity: 120,
    registered: 98,
    eligibility: "All students",
    selectionCriteria: "Singles and doubles matches",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/badminton-registration",
  },
  {
    name: "Chess Tournament",
    category: "Tournament",
    description: "Strategic chess tournament for all skill levels.",
    registrationOpen: new Date("2026-03-08"),
    registrationClose: new Date("2026-04-10"),
    venue: "Chess Club Room",
    coach: "Instructor Pradeep Kumar",
    maxCapacity: 50,
    registered: 23,
    eligibility: "All students",
    selectionCriteria: "Round-robin tournament format",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/chess-registration",
  },
  {
    name: "Carrom Championship",
    category: "Tournament",
    description: "Inter-batch carrom singles and doubles tournament.",
    registrationOpen: new Date("2026-03-15"),
    registrationClose: new Date("2026-04-15"),
    venue: "Recreation Center",
    coach: "Coordinator Ruwan Silva",
    maxCapacity: 40,
    registered: 15,
    eligibility: "All students",
    selectionCriteria: "Tournament knockout rounds",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/carrom-registration",
  },
  {
    name: "Table Tennis Trials",
    category: "Team Selection",
    description: "Selection for university table tennis team.",
    registrationOpen: new Date("2026-02-28"),
    registrationClose: new Date("2026-03-28"),
    venue: "Table Tennis Arena",
    coach: "Coach Dilshan Wickramasinghe",
    maxCapacity: 70,
    registered: 54,
    eligibility: "All students",
    selectionCriteria: "Singles matches and reaction time",
    requiresMedical: false,
    skillLevels: ["Beginner", "Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/tabletennis-registration",
  },
  {
    name: "Swimming Team Selection",
    category: "Team Selection",
    description: "Join the university swimming team for competitive events.",
    registrationOpen: new Date("2026-03-20"),
    registrationClose: new Date("2026-04-20"),
    venue: "University Pool",
    coach: "Coach Nimali Wickramarachchi",
    maxCapacity: 50,
    registered: 12,
    eligibility: "Students with swimming certification",
    selectionCriteria: "Freestyle, backstroke, breaststroke trials",
    requiresMedical: true,
    skillLevels: ["Intermediate", "Advanced"],
    registrationLink: "https://forms.gle/swimming-registration",
  },
];

// Seed function
const seedDatabase = async () => {
  try {
    await connectDB();

    // Clear existing sports data
    console.log("Clearing existing sports data...");
    await Sport.deleteMany({});

    console.log("Seeding sports data...");
    const createdSports = await Sport.insertMany(sportsData);

    console.log(`✅ Successfully seeded ${createdSports.length} sports!`);
    console.log("\nCreated Sports:");
    createdSports.forEach((sport) => {
      console.log(`- ${sport.name} (${sport.category})`);
    });

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding database:", error);
    process.exit(1);
  }
};

// Run seed function
seedDatabase();
