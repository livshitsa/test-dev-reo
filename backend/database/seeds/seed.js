import Database from 'better-sqlite3';
import bcrypt from 'bcrypt';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const DB_PATH = process.env.DATABASE_PATH || join(__dirname, '../school_scheduler.db');

async function seedDatabase() {
  try {
    console.log('Seeding database...');
    const db = new Database(DB_PATH);

    // Hash password for demo users
    const password = await bcrypt.hash('password123', 10);

    // Clear existing data
    console.log('Clearing existing data...');
    db.prepare('DELETE FROM enrollments').run();
    db.prepare('DELETE FROM time_slots').run();
    db.prepare('DELETE FROM classes').run();
    db.prepare('DELETE FROM users').run();

    // Seed Users
    console.log('Creating users...');

    // Admin
    const admin = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('Admin User', 'admin@school.com', password, 'admin');

    // Teachers
    const teacher1 = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('Dr. Sarah Johnson', 'sarah.johnson@school.com', password, 'teacher');

    const teacher2 = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('Prof. Michael Chen', 'michael.chen@school.com', password, 'teacher');

    const teacher3 = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('Dr. Emily Rodriguez', 'emily.rodriguez@school.com', password, 'teacher');

    const teacher4 = db.prepare(`
      INSERT INTO users (name, email, password_hash, role)
      VALUES (?, ?, ?, ?)
    `).run('Prof. David Kim', 'david.kim@school.com', password, 'teacher');

    // Students
    const students = [];
    const studentNames = [
      'Alice Smith', 'Bob Wilson', 'Charlie Brown', 'Diana Prince',
      'Ethan Hunt', 'Fiona Green', 'George Lee', 'Hannah White',
      'Ian Black', 'Julia Martinez', 'Kevin Park', 'Laura Davis',
      'Marcus Taylor', 'Nina Patel', 'Oliver Stone'
    ];

    studentNames.forEach((name, index) => {
      const email = `${name.toLowerCase().replace(' ', '.')}@student.school.com`;
      const result = db.prepare(`
        INSERT INTO users (name, email, password_hash, role)
        VALUES (?, ?, ?, ?)
      `).run(name, email, password, 'student');
      students.push(result.lastInsertRowid);
    });

    console.log(`Created ${studentNames.length} students`);

    // Seed Classes
    console.log('Creating classes...');

    const classes = [
      {
        name: 'Algebra I',
        subject: 'Mathematics',
        teacher_id: teacher1.lastInsertRowid,
        room: 'Room 101',
        capacity: 25,
        description: 'Introduction to algebraic concepts and problem solving'
      },
      {
        name: 'English Literature',
        subject: 'English',
        teacher_id: teacher2.lastInsertRowid,
        room: 'Room 202',
        capacity: 30,
        description: 'Study of classic and modern literature'
      },
      {
        name: 'Biology',
        subject: 'Science',
        teacher_id: teacher3.lastInsertRowid,
        room: 'Lab 301',
        capacity: 20,
        description: 'Introduction to life sciences and laboratory work'
      },
      {
        name: 'World History',
        subject: 'History',
        teacher_id: teacher4.lastInsertRowid,
        room: 'Room 103',
        capacity: 28,
        description: 'Survey of world civilizations and historical events'
      },
      {
        name: 'Physical Education',
        subject: 'PE',
        teacher_id: teacher1.lastInsertRowid,
        room: 'Gymnasium',
        capacity: 35,
        description: 'Physical fitness and sports activities'
      },
      {
        name: 'Chemistry',
        subject: 'Science',
        teacher_id: teacher3.lastInsertRowid,
        room: 'Lab 302',
        capacity: 20,
        description: 'Introduction to chemical principles and experiments'
      },
      {
        name: 'Geometry',
        subject: 'Mathematics',
        teacher_id: teacher2.lastInsertRowid,
        room: 'Room 104',
        capacity: 25,
        description: 'Study of shapes, angles, and spatial relationships'
      },
      {
        name: 'Spanish I',
        subject: 'Foreign Language',
        teacher_id: teacher4.lastInsertRowid,
        room: 'Room 205',
        capacity: 22,
        description: 'Introduction to Spanish language and culture'
      }
    ];

    const classIds = [];
    classes.forEach(cls => {
      const result = db.prepare(`
        INSERT INTO classes (name, subject, teacher_id, room, capacity, description)
        VALUES (?, ?, ?, ?, ?, ?)
      `).run(cls.name, cls.subject, cls.teacher_id, cls.room, cls.capacity, cls.description);
      classIds.push(result.lastInsertRowid);
    });

    console.log(`Created ${classes.length} classes`);

    // Seed Time Slots (Schedule)
    console.log('Creating schedule...');

    // Define time periods (in 45-minute blocks)
    const periods = [
      { start: '08:00', end: '08:45' }, // Period 1
      { start: '09:00', end: '09:45' }, // Period 2
      { start: '10:00', end: '10:45' }, // Period 3
      { start: '11:00', end: '11:45' }, // Period 4
      { start: '13:00', end: '13:45' }, // Period 5 (after lunch)
      { start: '14:00', end: '14:45' }, // Period 6
      { start: '15:00', end: '15:45' }  // Period 7
    ];

    // Create a varied schedule
    const scheduleAssignments = [
      // Algebra I - Period 1, Mon/Wed/Fri
      { classId: classIds[0], day: 0, period: 0 },
      { classId: classIds[0], day: 2, period: 0 },
      { classId: classIds[0], day: 4, period: 0 },

      // English Literature - Period 2, Mon/Tue/Thu
      { classId: classIds[1], day: 0, period: 1 },
      { classId: classIds[1], day: 1, period: 1 },
      { classId: classIds[1], day: 3, period: 1 },

      // Biology - Period 3, Tue/Thu
      { classId: classIds[2], day: 1, period: 2 },
      { classId: classIds[2], day: 3, period: 2 },

      // World History - Period 4, Mon/Wed/Fri
      { classId: classIds[3], day: 0, period: 3 },
      { classId: classIds[3], day: 2, period: 3 },
      { classId: classIds[3], day: 4, period: 3 },

      // PE - Period 5, Tue/Thu
      { classId: classIds[4], day: 1, period: 4 },
      { classId: classIds[4], day: 3, period: 4 },

      // Chemistry - Period 6, Mon/Wed
      { classId: classIds[5], day: 0, period: 5 },
      { classId: classIds[5], day: 2, period: 5 },

      // Geometry - Period 2, Wed/Fri
      { classId: classIds[6], day: 2, period: 1 },
      { classId: classIds[6], day: 4, period: 1 },

      // Spanish I - Period 3, Mon/Wed/Fri
      { classId: classIds[7], day: 0, period: 2 },
      { classId: classIds[7], day: 2, period: 2 },
      { classId: classIds[7], day: 4, period: 2 }
    ];

    scheduleAssignments.forEach(assignment => {
      const period = periods[assignment.period];
      db.prepare(`
        INSERT INTO time_slots (class_id, day_of_week, start_time, end_time)
        VALUES (?, ?, ?, ?)
      `).run(assignment.classId, assignment.day, period.start, period.end);
    });

    console.log(`Created ${scheduleAssignments.length} time slots`);

    // Seed Enrollments
    console.log('Creating enrollments...');

    let enrollmentCount = 0;
    students.forEach(studentId => {
      // Randomly enroll each student in 4-6 classes
      const numClasses = Math.floor(Math.random() * 3) + 4; // 4-6 classes
      const shuffledClassIds = [...classIds].sort(() => Math.random() - 0.5);
      const enrolledClasses = shuffledClassIds.slice(0, numClasses);

      enrolledClasses.forEach(classId => {
        db.prepare(`
          INSERT INTO enrollments (student_id, class_id)
          VALUES (?, ?)
        `).run(studentId, classId);
        enrollmentCount++;
      });
    });

    console.log(`Created ${enrollmentCount} enrollments`);

    // Summary
    console.log('\n=== Database Seeded Successfully! ===');
    console.log('Test Credentials:');
    console.log('  Admin: admin@school.com / password123');
    console.log('  Teacher: sarah.johnson@school.com / password123');
    console.log('  Student: alice.smith@student.school.com / password123');
    console.log('\nDatabase Statistics:');
    console.log(`  Users: ${db.prepare('SELECT COUNT(*) as count FROM users').get().count}`);
    console.log(`  Classes: ${db.prepare('SELECT COUNT(*) as count FROM classes').get().count}`);
    console.log(`  Time Slots: ${db.prepare('SELECT COUNT(*) as count FROM time_slots').get().count}`);
    console.log(`  Enrollments: ${db.prepare('SELECT COUNT(*) as count FROM enrollments').get().count}`);

    db.close();

  } catch (error) {
    console.error('Seeding failed:', error.message);
    process.exit(1);
  }
}

seedDatabase();
