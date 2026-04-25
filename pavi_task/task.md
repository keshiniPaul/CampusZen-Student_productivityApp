# StudyBridge – Feature Documentation

> Peer Academic Support Platform

---

## Table of Contents

1. [Study Group Creation](#1-study-group-creation)
2. [Resource Sharing](#2-resource-sharing)
3. [Assignment Tracking](#3-assignment-tracking)
4. [Timetable Management](#4-timetable-management)

---

## 1. Study Group Creation

Allows students to create or join study groups for specific modules.

### Pages

| Page | Path | Description |
|---|---|---|
| Study Groups List | `/study-groups` | Browse all public groups, search by module, create or join a group |
| Group Detail | `/study-groups/[groupId]` | View group info, members, and group resources |

### Components

| Component | Description |
|---|---|
| `GroupCard.tsx` | Displays group name, module tag, member count, and Join/View button |
| `GroupList.tsx` | Renders a grid of `GroupCard` components with filter tabs |
| `CreateGroupModal.tsx` | Modal form to create a new study group |
| `JoinGroupModal.tsx` | Confirm dialog before a student joins a group |
| `GroupMemberList.tsx` | Lists group members with their roles (Admin / Mentor / Member) |

### Component Props

```typescript
// GroupCard
interface GroupCardProps {
  id: string;
  name: string;
  module: string;
  memberCount: number;
  type: 'public' | 'private';
  isJoined: boolean;
  onJoin: (id: string) => void;
}

// GroupMemberList
interface Member {
  id: string;
  name: string;
  role: 'admin' | 'mentor' | 'member';
  avatarUrl?: string;
}
```

### CreateGroupModal – Form Fields

| Field | Type | Required |
|---|---|---|
| Group Name | Text input | ✅ |
| Module / Subject | Text input | ✅ |
| Description | Textarea | ❌ |
| Group Type | Radio (Public / Private) | ✅ |
| Max Members | Number input | ✅ |

### API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/study-groups` | Get all groups (`?module=&type=&search=`) |
| `POST` | `/api/study-groups` | Create a new study group |
| `GET` | `/api/study-groups/:groupId` | Get a specific group's details |
| `PUT` | `/api/study-groups/:groupId` | Update group (admin only) |
| `DELETE` | `/api/study-groups/:groupId` | Delete group (admin only) |
| `GET` | `/api/study-groups/:groupId/members` | Get group members |
| `POST` | `/api/study-groups/:groupId/members` | Join a group |
| `DELETE` | `/api/study-groups/:groupId/members/:userId` | Leave or remove a member |

### Database Model

```prisma
model StudyGroup {
  id          String     @id @default(cuid())
  name        String
  module      String
  description String?
  type        GroupType  @default(PUBLIC)
  maxMembers  Int        @default(20)
  createdAt   DateTime   @default(now())

  members     GroupMember[]
}

model GroupMember {
  id       String     @id @default(cuid())
  userId   String
  groupId  String
  role     MemberRole @default(MEMBER)
  joinedAt DateTime   @default(now())

  user     User       @relation(fields: [userId], references: [id])
  group    StudyGroup @relation(fields: [groupId], references: [id])

  @@unique([userId, groupId])
}

enum GroupType  { PUBLIC PRIVATE }
enum MemberRole { ADMIN MENTOR MEMBER }
```

---

## 2. Resource Sharing

Allows students to upload and access study materials.

### Pages

| Page | Path | Description |
|---|---|---|
| Resources | `/resources` | Browse, filter, upload, and download study materials |

### Components

| Component | Description |
|---|---|
| `ResourceCard.tsx` | Shows file icon, title, module, uploader name, and download button |
| `ResourceList.tsx` | Grid of `ResourceCard` components |
| `UploadResourceModal.tsx` | Modal form to upload a new study material |
| `ResourceFilter.tsx` | Filter bar for module, resource type, and sort order |

### Component Props

```typescript
// ResourceCard
interface ResourceCardProps {
  id: string;
  title: string;
  type: 'pdf' | 'notes' | 'slides' | 'video' | 'link';
  module: string;
  uploadedBy: string;
  uploadedAt: string;
  fileUrl: string;
  downloadCount: number;
}
```

### UploadResourceModal – Form Fields

| Field | Type | Required |
|---|---|---|
| Title | Text input | ✅ |
| Module / Subject | Text input | ✅ |
| Resource Type | Dropdown (PDF / Notes / Slides / Video / Link) | ✅ |
| File | File upload (drag & drop) | ✅ |
| Study Group | Dropdown (share to a group) | ❌ |
| Description | Textarea | ❌ |

### API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/resources` | Get all resources (supports filters) |
| `POST` | `/api/resources` | Upload a new resource (multipart/form-data) |
| `GET` | `/api/resources/:resourceId` | Get a specific resource |
| `PATCH` | `/api/resources/:resourceId` | Update resource metadata |
| `DELETE` | `/api/resources/:resourceId` | Delete resource (owner only) |

### Database Model

```prisma
model Resource {
  id            String       @id @default(cuid())
  title         String
  type          ResourceType
  module        String
  fileUrl       String
  description   String?
  downloadCount Int          @default(0)
  uploadedAt    DateTime     @default(now())

  uploadedById  String
  uploadedBy    User         @relation(fields: [uploadedById], references: [id])
  groupId       String?
  group         StudyGroup?  @relation(fields: [groupId], references: [id])
}

enum ResourceType { PDF NOTES SLIDES VIDEO LINK }
```

---

## 3. Assignment Tracking

Helps students track academic tasks and deadlines.

### Pages

| Page | Path | Description |
|---|---|---|
| Assignments | `/assignments` | View, create, and update assignments by status |

### Components

| Component | Description |
|---|---|
| `AssignmentCard.tsx` | Displays title, module, due date, priority badge, and status |
| `AssignmentList.tsx` | List or Kanban layout of `AssignmentCard` components |
| `CreateAssignmentModal.tsx` | Modal form to add a new assignment |
| `DeadlineCountdown.tsx` | Shows time remaining; color changes as deadline nears |

### Component Props

```typescript
// AssignmentCard
interface AssignmentCardProps {
  id: string;
  title: string;
  module: string;
  dueDate: string;
  status: 'pending' | 'in-progress' | 'completed' | 'overdue';
  priority: 'low' | 'medium' | 'high';
  onStatusChange: (id: string, status: string) => void;
}

// DeadlineCountdown
interface DeadlineCountdownProps {
  dueDate: string; // ISO string
}
```

### CreateAssignmentModal – Form Fields

| Field | Type | Required |
|---|---|---|
| Assignment Title | Text input | ✅ |
| Module / Subject | Text input | ✅ |
| Due Date & Time | Date + time picker | ✅ |
| Priority | Dropdown (Low / Medium / High) | ✅ |
| Notes | Textarea | ❌ |

### Status Flow

```
PENDING → IN_PROGRESS → COMPLETED
                ↓
            OVERDUE  (auto-set when dueDate passes)
```

### API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/assignments` | Get all assignments for current user |
| `POST` | `/api/assignments` | Create a new assignment |
| `GET` | `/api/assignments/:assignmentId` | Get a specific assignment |
| `PUT` | `/api/assignments/:assignmentId` | Update full assignment details |
| `PATCH` | `/api/assignments/:assignmentId` | Update status only |
| `DELETE` | `/api/assignments/:assignmentId` | Delete an assignment |

### Database Model

```prisma
model Assignment {
  id        String           @id @default(cuid())
  title     String
  module    String
  dueDate   DateTime
  status    AssignmentStatus @default(PENDING)
  priority  Priority         @default(MEDIUM)
  notes     String?
  createdAt DateTime         @default(now())

  userId    String
  user      User @relation(fields: [userId], references: [id])
}

enum AssignmentStatus { PENDING IN_PROGRESS COMPLETED OVERDUE }
enum Priority        { LOW MEDIUM HIGH }
```

---

## 4. Timetable Management

Allows students to plan weekly study schedules.

### Pages

| Page | Path | Description |
|---|---|---|
| Timetable | `/timetable` | View and manage the full weekly study schedule |

### Components

| Component | Description |
|---|---|
| `WeeklyCalendar.tsx` | 7-column Mon–Sun grid with hourly time rows (6AM–10PM) |
| `TimeSlotCard.tsx` | Color-coded block showing subject, time range, and session type |
| `AddSlotModal.tsx` | Modal form to add a new time slot |

### Component Props

```typescript
// TimeSlotCard
interface TimeSlotCardProps {
  id: string;
  subject: string;
  startTime: string;  // "09:00"
  endTime: string;    // "11:00"
  type: 'lecture' | 'study' | 'group-session' | 'revision';
  color: string;      // hex e.g. "#4F46E5"
  onDelete: (id: string) => void;
}
```

### AddSlotModal – Form Fields

| Field | Type | Required |
|---|---|---|
| Subject / Module | Text input | ✅ |
| Day of Week | Dropdown (Mon–Sun) | ✅ |
| Start Time | Time picker | ✅ |
| End Time | Time picker | ✅ |
| Session Type | Dropdown (Lecture / Study / Group Session / Revision) | ✅ |
| Color | Color picker | ✅ |
| Repeat Weekly | Toggle | ❌ |

### API Routes

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/timetable` | Get current user's weekly timetable |
| `POST` | `/api/timetable` | Add a new time slot |
| `PUT` | `/api/timetable/:slotId` | Update a time slot |
| `DELETE` | `/api/timetable/:slotId` | Delete a time slot |

### Database Model

```prisma
model TimetableSlot {
  id        String      @id @default(cuid())
  subject   String
  dayOfWeek Int         // 0 = Monday … 6 = Sunday
  startTime String      // "09:00"
  endTime   String      // "11:00"
  type      SessionType
  color     String      @default("#4F46E5")
  repeat    Boolean     @default(true)
  createdAt DateTime    @default(now())

  userId    String
  user      User @relation(fields: [userId], references: [id])
}

enum SessionType { LECTURE STUDY GROUP_SESSION REVISION }
```

---

*StudyBridge — Feature Documentation v1.0*