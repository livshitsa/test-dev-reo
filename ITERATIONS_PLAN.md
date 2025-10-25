# School Class Scheduling App - Iterations Plan

## Project Overview
A simple web application for managing school class schedules with role-based access for admins, teachers, and students.

---

## Iteration 1: Project Setup & Database Foundation
**Duration:** 1-2 days
**Goal:** Establish project structure and database layer

### Tasks
1. **Initialize Project Structure**
   - [ ] Create root project directory structure
   - [ ] Initialize backend (Node.js + Express)
   - [ ] Initialize frontend (React + Vite)
   - [ ] Set up Git repository with proper `.gitignore`
   - [ ] Create `package.json` for both frontend and backend

2. **Database Setup**
   - [ ] Install database driver (pg for PostgreSQL or better-sqlite3)
   - [ ] Create database schema SQL file
   - [ ] Set up database connection module
   - [ ] Create migration system (or use Prisma/TypeORM)
   - [ ] Write seed data script for testing

3. **Backend Foundation**
   - [ ] Set up Express server with basic routing
   - [ ] Configure middleware (cors, json parser, error handler)
   - [ ] Create environment configuration (.env)
   - [ ] Set up basic logging

4. **Development Tools**
   - [ ] Configure ESLint and Prettier
   - [ ] Set up nodemon for backend hot reload
   - [ ] Configure Vite dev server for frontend

### Deliverables
- Working dev environment
- Database schema created and seeded
- Basic Express server running
- React app scaffold running

### Database Schema
```sql
-- Users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) CHECK (role IN ('admin', 'teacher', 'student')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Classes table
CREATE TABLE classes (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  teacher_id INTEGER REFERENCES users(id),
  room VARCHAR(50),
  capacity INTEGER DEFAULT 30,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- TimeSlots table
CREATE TABLE time_slots (
  id SERIAL PRIMARY KEY,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  day_of_week INTEGER CHECK (day_of_week BETWEEN 0 AND 4), -- 0=Mon, 4=Fri
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(day_of_week, start_time, room),
  UNIQUE(teacher_id, day_of_week, start_time)
);

-- Enrollments table
CREATE TABLE enrollments (
  id SERIAL PRIMARY KEY,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  class_id INTEGER REFERENCES classes(id) ON DELETE CASCADE,
  enrolled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(student_id, class_id)
);
```

---

## Iteration 2: Authentication & User Management
**Duration:** 2-3 days
**Goal:** Implement secure user authentication and role-based access

### Tasks
1. **Backend Authentication**
   - [ ] Install dependencies (bcrypt, jsonwebtoken)
   - [ ] Create User model/repository
   - [ ] Implement password hashing with bcrypt
   - [ ] Create JWT token generation and validation
   - [ ] Build auth middleware for protected routes

2. **Auth API Endpoints**
   - [ ] POST `/api/auth/register` - User registration
   - [ ] POST `/api/auth/login` - User login
   - [ ] GET `/api/auth/me` - Get current user
   - [ ] POST `/api/auth/logout` - Logout (optional)

3. **Frontend Auth Components**
   - [ ] Create Login page
   - [ ] Create Register page
   - [ ] Build authentication context/store
   - [ ] Implement token storage (localStorage)
   - [ ] Create ProtectedRoute component
   - [ ] Build basic navigation/header with logout

4. **Role-Based Access Control**
   - [ ] Create permission middleware
   - [ ] Define role permissions (admin, teacher, student)
   - [ ] Protect routes based on roles

### Deliverables
- Users can register and login
- JWT-based authentication working
- Protected routes implemented
- Role-based access control functional

### API Endpoints
```
POST   /api/auth/register  - Register new user
POST   /api/auth/login     - Login and get JWT
GET    /api/auth/me        - Get current user profile
```

---

## Iteration 3: Classes Management (Backend)
**Duration:** 2-3 days
**Goal:** Build complete CRUD API for managing classes

### Tasks
1. **Classes Model & Repository**
   - [ ] Create Classes model
   - [ ] Build database query functions (CRUD)
   - [ ] Add validation logic
   - [ ] Create helper functions for teacher lookup

2. **Classes API Endpoints**
   - [ ] GET `/api/classes` - List all classes (with filters)
   - [ ] GET `/api/classes/:id` - Get single class details
   - [ ] POST `/api/classes` - Create class (admin only)
   - [ ] PUT `/api/classes/:id` - Update class (admin only)
   - [ ] DELETE `/api/classes/:id` - Delete class (admin only)
   - [ ] GET `/api/classes/:id/students` - Get enrolled students

3. **Validation & Error Handling**
   - [ ] Validate class data (capacity, teacher exists, etc.)
   - [ ] Check teacher_id references valid teacher user
   - [ ] Handle duplicate class names
   - [ ] Return proper error messages

4. **Testing**
   - [ ] Test all CRUD operations with Postman/Thunder Client
   - [ ] Test authorization (only admin can create/edit)
   - [ ] Test with seed data

### Deliverables
- Complete classes CRUD API
- Proper validation and error handling
- Admin-only access enforced
- API tested and working

---

## Iteration 4: Schedule Management (Backend)
**Duration:** 2-3 days
**Goal:** Implement time slot management and conflict detection

### Tasks
1. **TimeSlots Model & Repository**
   - [ ] Create TimeSlots model
   - [ ] Build CRUD operations for time slots
   - [ ] Create query to get full weekly schedule
   - [ ] Build query for user-specific schedules

2. **Conflict Detection Logic**
   - [ ] Check room availability (no double-booking)
   - [ ] Check teacher availability
   - [ ] Check student schedule conflicts (optional)
   - [ ] Return detailed conflict information

3. **Schedule API Endpoints**
   - [ ] GET `/api/schedule` - Get full school schedule
   - [ ] GET `/api/schedule/weekly` - Get schedule by week
   - [ ] GET `/api/schedule/my` - Get current user's schedule
   - [ ] POST `/api/timeslots` - Add class to schedule (admin)
   - [ ] PUT `/api/timeslots/:id` - Update time slot (admin)
   - [ ] DELETE `/api/timeslots/:id` - Remove from schedule (admin)

4. **Schedule Validation**
   - [ ] Validate time slot doesn't conflict
   - [ ] Validate day_of_week is 0-4 (Mon-Fri)
   - [ ] Validate start_time < end_time
   - [ ] Validate class exists

### Deliverables
- Schedule CRUD API working
- Conflict detection preventing double-bookings
- Users can retrieve their personal schedules
- Admin can build weekly schedule

---

## Iteration 5: Enrollment Management (Backend)
**Duration:** 1-2 days
**Goal:** Handle student enrollment in classes

### Tasks
1. **Enrollments Model & Repository**
   - [ ] Create Enrollments model
   - [ ] Build enrollment CRUD operations
   - [ ] Check class capacity before enrollment
   - [ ] Get all enrollments for a student/class

2. **Enrollment API Endpoints**
   - [ ] GET `/api/enrollments/my` - Get my enrollments
   - [ ] POST `/api/enrollments` - Enroll in class
   - [ ] DELETE `/api/enrollments/:id` - Unenroll from class
   - [ ] GET `/api/classes/:id/enrollments` - Get class roster

3. **Enrollment Validation**
   - [ ] Check class capacity not exceeded
   - [ ] Prevent duplicate enrollments
   - [ ] Check student not already enrolled
   - [ ] Validate student and class exist

4. **Business Logic**
   - [ ] Auto-check for schedule conflicts on enrollment
   - [ ] Return available spots in class
   - [ ] Allow admin to override capacity (optional)

### Deliverables
- Students can enroll in classes
- Enrollment validation working
- Capacity limits enforced
- Conflict checking on enrollment

---

## Iteration 6: Frontend - Classes UI
**Duration:** 3-4 days
**Goal:** Build user interface for viewing and managing classes

### Tasks
1. **Classes List Page**
   - [ ] Create ClassesList component
   - [ ] Fetch and display all classes
   - [ ] Add search/filter functionality
   - [ ] Show class details (teacher, room, capacity)
   - [ ] Add pagination or infinite scroll

2. **Class Details Page**
   - [ ] Create ClassDetails component
   - [ ] Display full class information
   - [ ] Show enrolled students count
   - [ ] Show schedule (which days/times)
   - [ ] Add enroll/unenroll button for students

3. **Admin Class Management**
   - [ ] Create ClassForm component
   - [ ] Build Create Class page (admin)
   - [ ] Build Edit Class page (admin)
   - [ ] Add delete confirmation dialog
   - [ ] Validate form inputs

4. **UI/UX Polish**
   - [ ] Add loading states
   - [ ] Add error messages
   - [ ] Create responsive design
   - [ ] Add success notifications

### Deliverables
- Users can browse classes
- Students can view class details
- Admins can create/edit/delete classes
- Clean, responsive UI

---

## Iteration 7: Frontend - Schedule Builder (Admin)
**Duration:** 4-5 days
**Goal:** Build drag-and-drop schedule builder for admins

### Tasks
1. **Weekly Grid Component**
   - [ ] Create ScheduleGrid component
   - [ ] Build 5-day (Mon-Fri) grid layout
   - [ ] Add time slots (8 AM - 4 PM in 45-min blocks)
   - [ ] Style grid with CSS Grid or table
   - [ ] Make responsive for mobile

2. **Drag-and-Drop Functionality**
   - [ ] Install react-dnd or similar library
   - [ ] Create draggable Class components
   - [ ] Create droppable TimeSlot components
   - [ ] Handle drop events
   - [ ] Update backend via API on drop

3. **Schedule Management Features**
   - [ ] Fetch existing schedule on load
   - [ ] Display classes in their time slots
   - [ ] Allow removing classes from schedule
   - [ ] Show class details on hover
   - [ ] Add quick edit/delete actions

4. **Conflict Detection UI**
   - [ ] Show visual warning for conflicts
   - [ ] Prevent dropping if conflict exists
   - [ ] Display conflict details in modal
   - [ ] Highlight conflicting time slots

### Deliverables
- Admin can drag classes onto schedule
- Weekly schedule view working
- Conflict detection prevents issues
- Intuitive drag-and-drop interface

---

## Iteration 8: Frontend - Student/Teacher Views
**Duration:** 2-3 days
**Goal:** Build personalized schedule views for students and teachers

### Tasks
1. **My Schedule Page**
   - [ ] Create MySchedule component
   - [ ] Fetch user's personal schedule
   - [ ] Display in weekly grid view
   - [ ] Show only enrolled/teaching classes
   - [ ] Add print/export option (optional)

2. **Dashboard/Home Page**
   - [ ] Create Dashboard component
   - [ ] Show today's classes
   - [ ] Display upcoming classes
   - [ ] Show quick stats (enrolled courses, etc.)
   - [ ] Add role-specific content

3. **Student Enrollment UI**
   - [ ] Add "Enroll" button on class pages
   - [ ] Show enrollment status
   - [ ] Display "My Classes" section
   - [ ] Allow unenrolling from classes
   - [ ] Show waitlist if class full (optional)

4. **Teacher View**
   - [ ] Show classes they're teaching
   - [ ] Display student roster for each class
   - [ ] Show teaching schedule

### Deliverables
- Students see personalized schedule
- Teachers see their classes and students
- Dashboard shows relevant information
- Enrollment workflow complete

---

## Iteration 9: UI/UX Polish & Responsive Design
**Duration:** 2-3 days
**Goal:** Improve user experience and mobile responsiveness

### Tasks
1. **Design System**
   - [ ] Define color palette
   - [ ] Set up Tailwind theme/config
   - [ ] Create reusable component library
   - [ ] Standardize spacing and typography
   - [ ] Add consistent icons

2. **Responsive Design**
   - [ ] Test on mobile devices
   - [ ] Adjust schedule grid for small screens
   - [ ] Make navigation mobile-friendly
   - [ ] Ensure forms work on mobile
   - [ ] Test on tablet sizes

3. **User Experience**
   - [ ] Add loading spinners
   - [ ] Improve error messages
   - [ ] Add success notifications (toast)
   - [ ] Implement better validation feedback
   - [ ] Add confirmation dialogs for destructive actions

4. **Accessibility**
   - [ ] Add proper ARIA labels
   - [ ] Ensure keyboard navigation works
   - [ ] Test with screen reader
   - [ ] Add focus states
   - [ ] Ensure color contrast meets standards

### Deliverables
- Polished, professional UI
- Fully responsive design
- Improved user experience
- Better accessibility

---

## Iteration 10: Testing & Bug Fixes
**Duration:** 2-3 days
**Goal:** Comprehensive testing and bug resolution

### Tasks
1. **Backend Testing**
   - [ ] Write unit tests for models
   - [ ] Write integration tests for API endpoints
   - [ ] Test authentication flows
   - [ ] Test conflict detection logic
   - [ ] Test edge cases (capacity, overlaps, etc.)

2. **Frontend Testing**
   - [ ] Test user flows (login, enroll, create class)
   - [ ] Test drag-and-drop functionality
   - [ ] Test responsive design
   - [ ] Test error handling
   - [ ] Cross-browser testing

3. **Security Review**
   - [ ] Check for SQL injection vulnerabilities
   - [ ] Verify JWT implementation
   - [ ] Test authorization on all endpoints
   - [ ] Validate all user inputs
   - [ ] Check for XSS vulnerabilities

4. **Bug Fixes**
   - [ ] Fix identified bugs from testing
   - [ ] Address edge cases
   - [ ] Improve error handling
   - [ ] Fix UI glitches

### Deliverables
- Comprehensive test coverage
- All major bugs fixed
- Security vulnerabilities addressed
- Stable, production-ready app

---

## Iteration 11: Documentation & Deployment
**Duration:** 2-3 days
**Goal:** Document the project and deploy to production

### Tasks
1. **Documentation**
   - [ ] Write README with setup instructions
   - [ ] Document API endpoints
   - [ ] Create user guide
   - [ ] Document environment variables
   - [ ] Add code comments where needed

2. **Deployment Preparation**
   - [ ] Set up production database
   - [ ] Configure environment for production
   - [ ] Set up build process
   - [ ] Optimize bundle size
   - [ ] Set up error logging (Sentry, etc.)

3. **Deploy Backend**
   - [ ] Choose hosting (Railway, Render, Heroku)
   - [ ] Deploy API server
   - [ ] Set up database migrations
   - [ ] Configure CORS for production
   - [ ] Test production API

4. **Deploy Frontend**
   - [ ] Build production bundle
   - [ ] Deploy to Vercel/Netlify
   - [ ] Configure API endpoints
   - [ ] Test production deployment
   - [ ] Set up custom domain (optional)

### Deliverables
- Complete documentation
- App deployed to production
- Working live demo
- Deployment guide

---

## Optional Future Enhancements

### Phase 2 Features (Post-MVP)
1. **Advanced Scheduling**
   - Recurring events (daily, weekly patterns)
   - Multi-period classes
   - Break time management
   - Class prerequisites

2. **Enhanced Features**
   - Email notifications for schedule changes
   - Calendar export (iCal format)
   - Attendance tracking
   - Grade management integration

3. **Reporting**
   - Class enrollment reports
   - Teacher workload analysis
   - Room utilization statistics
   - Schedule conflict reports

4. **Admin Tools**
   - Bulk import students/classes (CSV)
   - Academic year management
   - Semester/term support
   - Archive old schedules

---

## Success Criteria

### Minimum Viable Product (MVP)
- ✅ Users can register and login with role-based access
- ✅ Admins can create and manage classes
- ✅ Admins can build weekly schedules with drag-and-drop
- ✅ System prevents scheduling conflicts (room, teacher)
- ✅ Students can enroll in classes
- ✅ Students can view their personal schedule
- ✅ Teachers can view their teaching schedule
- ✅ Responsive design works on desktop and mobile
- ✅ App is deployed and accessible online

### Performance Targets
- Page load time < 2 seconds
- API response time < 500ms
- Works on Chrome, Firefox, Safari, Edge
- Mobile-friendly (responsive down to 320px width)

---

## Timeline Summary

| Iteration | Duration | Cumulative |
|-----------|----------|------------|
| 1. Project Setup | 1-2 days | 2 days |
| 2. Authentication | 2-3 days | 5 days |
| 3. Classes Backend | 2-3 days | 8 days |
| 4. Schedule Backend | 2-3 days | 11 days |
| 5. Enrollment Backend | 1-2 days | 13 days |
| 6. Classes Frontend | 3-4 days | 17 days |
| 7. Schedule Builder | 4-5 days | 22 days |
| 8. Student/Teacher Views | 2-3 days | 25 days |
| 9. UI/UX Polish | 2-3 days | 28 days |
| 10. Testing | 2-3 days | 31 days |
| 11. Deployment | 2-3 days | 34 days |

**Total Estimated Time:** 4-5 weeks (with buffer)

---

## Tech Stack Summary

**Frontend:**
- React 18
- Vite
- React Router
- TailwindCSS
- React DnD (drag-and-drop)
- Axios (HTTP client)
- React Hook Form (forms)

**Backend:**
- Node.js 18+
- Express.js
- PostgreSQL or SQLite
- bcrypt (password hashing)
- jsonwebtoken (JWT auth)
- dotenv (environment config)

**Development Tools:**
- ESLint + Prettier
- Git
- Postman/Thunder Client
- nodemon

**Deployment:**
- Backend: Railway, Render, or Heroku
- Frontend: Vercel or Netlify
- Database: Railway Postgres or Supabase

---

## Getting Started

To begin implementation, start with **Iteration 1** and proceed sequentially. Each iteration builds on the previous one, so following the order is recommended.

Good luck with your school scheduling app! 🚀
