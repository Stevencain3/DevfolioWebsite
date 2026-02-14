# DevFolio - My Portfolio Website

**CSC 363 Human-Computer Interaction Final Project**  
**Student:** Steven M Cain Jr.  
**Date:** December 8, 2025

## What I Built

I created a full-stack portfolio website called DevFolio where I can showcase my projects, share information about myself, and let people contact me. The site has a public side that anyone can view and an admin dashboard where I can manage everything through a web interface instead of having to manually edit code.

## Getting Started - How to Run My Project

### Backend Server

1. Open terminal and navigate to backend folder:
   ```bash
   cd devfolio-backend
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```

4. You should see: `DevFolio server listening on port 8080`

### Frontend Development Server

1. Open a second terminal and navigate to frontend folder:
   ```bash
   cd devfolio-frontend
   ```

2. Install dependencies (first time only):
   ```bash
   npm install
   ```

3. Start the dev server:
   ```bash
   npm run dev
   ```

4. Open your browser to `http://localhost:5173` (or whatever port it shows)

### Database Setup

1. I'm using MySQL Workbench with a database called `devfolio`
2. All my database tables are listed in the "Database Structure" section below
3. To create the tables, just run the SQL code shown for each table

## My Tech Stack

**Frontend (What Users See):**
- React 19.2.0 - for building the user interface
- Redux Toolkit - for managing app state (logged in admin, projects, profile data)
- React Router v7 - for navigation between pages
- Tailwind CSS - for styling everything
- Vite - development server with fast hot reload

**Backend (Server Side):**
- Node.js with Express - handles API requests
- MySQL - stores all my data
- bcrypt - securely hashes admin password
- CORS - allows frontend to talk to backend

## Database Structure

I designed my database to store everything I need for the portfolio. Here's what each table does:

### admin

Stores my login credentials so I can access the admin dashboard.

```sql
CREATE TABLE admin (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL
);
```

### projects

The main table for all my projects - both digital (websites, apps) and physical (engine rebuilds, etc).

```sql
CREATE TABLE projects (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  short_description TEXT,
  long_description TEXT,
  github_url VARCHAR(255),
  live_url VARCHAR(255),
  tags TEXT,
  type TINYINT DEFAULT 0, -- 0 = physical, 1 = digital
  is_published TINYINT DEFAULT 0, -- 0 = draft, 1 = published
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### project_images

Each project can have multiple images. I can add them via URL or by uploading files.

```sql
CREATE TABLE project_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  project_id INT NOT NULL,
  image_path VARCHAR(500) NOT NULL,
  caption TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (project_id) REFERENCES projects(id) ON DELETE CASCADE
);
```

### contacts

When someone fills out the contact form, their message gets saved here.

```sql
CREATE TABLE contacts (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  subject VARCHAR(500) NOT NULL,
  message TEXT NOT NULL,
  project_details TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### profile

Basic info about me that shows on the About page.

```sql
CREATE TABLE profile (
  id INT PRIMARY KEY DEFAULT 1,
  full_name VARCHAR(255),
  bio TEXT,
  philosophy TEXT,
  photo_url VARCHAR(500),
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### skills

My technical skills organized by category (programming, tools, professional).

```sql
CREATE TABLE skills (
  id INT AUTO_INCREMENT PRIMARY KEY,
  category VARCHAR(50) NOT NULL, -- 'programming', 'tools', or 'professional'
  skill_name VARCHAR(255) NOT NULL,
  sort_order INT DEFAULT 0
);
```

### experience

My work experience entries for the About page.

```sql
CREATE TABLE experience (
  id INT AUTO_INCREMENT PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  company VARCHAR(255),
  period VARCHAR(100),
  description TEXT,
  sort_order INT DEFAULT 0
);
```

### education

My education history.

```sql
CREATE TABLE education (
  id INT AUTO_INCREMENT PRIMARY KEY,
  school VARCHAR(255) NOT NULL,
  degree VARCHAR(255),
  period VARCHAR(100),
  coursework TEXT,
  sort_order INT DEFAULT 0
);
```

### interests

A single text field for my interests/hobbies section.

```sql
CREATE TABLE interests (
  id INT PRIMARY KEY DEFAULT 1,
  content TEXT
);
```

## API Endpoints - How Frontend Talks to Backend

I organized my API into logical sections. All routes start with `/api/`.

### Projects

- `GET /api/projects` - Gets all projects with their first image
- `POST /api/projects` - Creates a new project
- `PUT /api/projects/:id` - Updates an existing project
- `PUT /api/projects/:id/publish` - Toggles published status (draft/published)
- `DELETE /api/projects/:id` - Deletes project and all its images

### Project Images

- `GET /api/projects/:projectId/images` - Gets all images for a specific project
- `POST /api/projects/:projectId/images` - Adds image to project (by URL)
- `DELETE /api/project-images/:imageId` - Deletes a specific image

### Admin Authentication

- `POST /api/admin/signin` - Login with username/password

### Contact Form

- `POST /api/contacts` - Saves contact form submission

### Profile (About Page Data)

- `GET /api/profile` - Gets all about page content (profile, skills, experience, education, interests)
- `PUT /api/profile` - Updates profile information
- `POST /api/skills` - Adds a new skill
- `DELETE /api/skills/:id` - Removes a skill
- `POST /api/experience` - Adds work experience
- `PUT /api/experience/:id` - Updates work experience
- `DELETE /api/experience/:id` - Removes work experience
- `PUT /api/education/:id` - Updates education entry
- `PUT /api/interests` - Updates interests text

## Frontend Routes - What URLs Do

### Public Pages (Anyone Can View)

- `/` - Home page with intro and my photo
- `/projects` - Gallery of all published projects (drafts hidden)
- `/about` - About me page with bio, skills, experience, education
- `/contact` - Contact form

### Private Pages (Admin Only)

- `/admin/login` - Login page (has easter egg: "You name better be Steven if you're on this page…")
- `/admin` - Admin dashboard where I manage projects and images

## Key Components I Built

### Navigation

- **SideNav** - The cool sliding sidebar that appears on desktop (hidden on mobile)
- **MobileMenu** - Hamburger menu for mobile devices
- **ProtectedRoute** - Wraps admin routes, redirects to login if not authenticated

### Project Management

- **ProjectForm** - Form to create/edit projects with all fields
- **ProjectList** - Shows all projects with edit/delete/publish buttons
- **ProjectCard** - Individual project card display
- **ProjectDetailModal** - Popup modal showing full project details

### Image Management

- **ImageUploader** - Upload images by pasting a URL (file upload removed to simplify)
- **ImageList** - Displays project images with delete buttons

### Other

- **SocialLinks** - Footer with my social media links

## How Redux State Management Works

I use Redux Toolkit to manage app state. Here are my slices:

### authSlice

Handles admin login state.

- **State:** `admin` (logged in user), `status` (loading/idle/error)
- **Actions:**
  - `signIn` - Login with credentials
  - `signOut` - Logout and clear state
  - `fetchMe` - Get current admin (not implemented on backend yet)

### projectsSlice

Manages project data.

- **State:** `items` (array of projects), `status`
- **Actions:**
  - `fetchProjects` - Load all projects
  - `createProject` - Add new project
  - `updateProject` - Edit project
  - `deleteProject` - Remove project
  - `togglePublishProject` - Switch between draft/published

### mediaSlice

Handles project images.

- **State:** `imagesByProject` (object mapping projectId to array of images), `status`
- **Actions:**
  - `fetchImages` - Load images for a project
  - `uploadImage` - Add image by URL
  - `deleteImage` - Remove image

### profileSlice

Manages About page data.

- **State:** `profile`, `skills`, `experience`, `education`, `interests`, `status`
- **Actions:**
  - `fetchProfile` - Load all about page data from database

## Project Structure

```
devfolio/
├── devfolio-backend/
│   ├── index.js
│   ├── package.json
│   └── uploads/
└── devfolio-frontend/
    ├── eslint.config.js
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── README.md
    ├── tailwind.config.js
    ├── vite.config.js
    ├── public/
    │   └── site.webmanifest
    └── src/
        ├── App.jsx
        ├── index.css
        ├── main.jsx
        ├── api/
        │   └── apiClient.js
        ├── assets/
        ├── components/
        │   ├── ImageList.jsx
        │   ├── ImageUploader.jsx
        │   ├── MobileMenu.jsx
        │   ├── ProjectCard.jsx
        │   ├── ProjectDetailModal.jsx
        │   ├── ProjectForm.jsx
        │   ├── ProjectList.jsx
        │   ├── ProtectedRoute.jsx
        │   ├── SideNav.jsx
        │   └── SocialLinks.jsx
        ├── pages/
        │   ├── AboutPage.jsx
        │   ├── ContactPage.jsx
        │   ├── HomePage.jsx
        │   ├── ProjectsPage.jsx
        │   └── admin/
        │       ├── AdminDashboard.jsx
        │       └── AdminLogin.jsx
        └── store/
            ├── store.js
            └── slices/
                ├── authSlice.js
                ├── mediaSlice.js
                ├── profileSlice.js
                └── projectsSlice.js
```
