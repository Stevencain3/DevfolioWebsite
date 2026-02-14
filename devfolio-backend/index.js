const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const path = require('path');

const app = express();

// Static file serving
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Middleware
app.use(cors({ 
  origin: ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"], 
  credentials: true 
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// Database connection
const db = mysql.createPool({
  connectionLimit: 10,
  host: 'localhost',
  user: 'root',
  password: 'S0C0hgv2005',
  database: 'devfolio'
});
app.get('/', (req, res) => {
  res.send('DevFolio API is running');
});

// ====================
// PROJECTS
// ====================

// Get all projects with first image
app.get("/api/projects", (req, res) => {
  const sql = `
    SELECT 
      p.*,
      (SELECT image_path FROM project_images WHERE project_id = p.id ORDER BY sort_order ASC, id ASC LIMIT 1) as image_path
    FROM projects p
    ORDER BY p.created_at DESC
  `;

  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching projects:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json(rows);
  });
});

// Create new project
app.post("/api/projects", (req, res) => {
  const {
    title,
    short_description,
    long_description,
    github_url,
    live_url,
    tags,
    type,
    is_published
  } = req.body;

  const sql = `
    INSERT INTO projects 
      (title, short_description, long_description, github_url, live_url, tags, type, is_published)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [
      title,
      short_description || null,
      long_description || null,
      github_url || null,
      live_url || null,
      tags || null,
      Number(type),
      is_published ? 1 : 0
    ],
    (err, result) => {
      if (err) {
        console.error("Error inserting project:", err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }

      res.json({ ok: true, id: result.insertId });
    }
  );
});

// PUT /api/projects/:id -> update a project
app.put("/api/projects/:id", (req, res) => {
  const { id } = req.params;
  const {
    title,
    short_description,
    long_description,
    github_url,
    live_url,
    tags,
    type,
    is_published
  } = req.body;

  const sql = `
    UPDATE projects 
    SET title = ?, 
        short_description = ?, 
        long_description = ?, 
        github_url = ?, 
        live_url = ?, 
        tags = ?, 
        type = ?, 
        is_published = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      title,
      short_description || null,
      long_description || null,
      github_url || null,
      live_url || null,
      tags || null,
      Number(type),
      is_published ? 1 : 0,
      id
    ],
    (err, result) => {
      if (err) {
        console.error("Error updating project:", err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }

      res.json({ ok: true, id });
    }
  );
});

// Toggle project published status
app.put("/api/projects/:id/publish", (req, res) => {
  const { id } = req.params;
  const { is_published } = req.body;

  const sql = "UPDATE projects SET is_published = ? WHERE id = ?";

  db.query(sql, [is_published ? 1 : 0, id], (err, result) => {
    if (err) {
      console.error("Error updating project publish status:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }

    res.json({ ok: true, id, is_published });
  });
});

// Delete project and its images
app.delete("/api/projects/:id", (req, res) => {
  const { id } = req.params;

  // Delete images first
  const deleteImagesSql = "DELETE FROM project_images WHERE project_id = ?";
  
  db.query(deleteImagesSql, [id], (err) => {
    if (err) {
      console.error("Error deleting project images:", err);
      return res.status(500).json({ ok: false, message: "DB error deleting images" });
    }

    // Then delete project
    const deleteProjectSql = "DELETE FROM projects WHERE id = ?";
    
    db.query(deleteProjectSql, [id], (err, result) => {
      if (err) {
        console.error("Error deleting project:", err);
        return res.status(500).json({ ok: false, message: "DB error deleting project" });
      }

      res.json({ ok: true, id });
    });
  });
});

// ====================
// PROJECT IMAGES
// ====================

// Get images for project
app.get("/api/projects/:projectId/images", (req, res) => {
  const { projectId } = req.params;

  const sql = `
    SELECT * FROM project_images
    WHERE project_id = ?
    ORDER BY sort_order ASC, id ASC
  `;

  db.query(sql, [projectId], (err, rows) => {
    if (err) {
      console.error("Error fetching project images:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json(rows);
  });
});

// Add image to project
app.post("/api/projects/:projectId/images", (req, res) => {
  const { projectId } = req.params;
  const { image_path, caption, sort_order } = req.body;

  const sql = `
    INSERT INTO project_images (project_id, image_path, caption, sort_order)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    sql,
    [projectId, image_path, caption || null, sort_order ?? 0],
    (err, result) => {
      if (err) {
        console.error("Error inserting project image:", err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }
      // Return the complete image object
      res.json({ 
        id: result.insertId, 
        project_id: projectId, 
        image_path, 
        caption: caption || null, 
        sort_order: sort_order ?? 0 
      });
    }
  );
});

// Delete image
app.delete("/api/project-images/:imageId", (req, res) => {
  const { imageId } = req.params;

  db.query(
    "DELETE FROM project_images WHERE id = ?",
    [imageId],
    (err, result) => {
      if (err) {
        console.error("Error deleting project image:", err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }
      res.json({ ok: true, affectedRows: result.affectedRows });
    }
  );
});

// ====================
// ADMIN AUTH
// ====================

// Admin login
app.post("/api/admin/signin", (req, res) => {
  const { username, password } = req.body;

  db.query(
    "SELECT * FROM admin WHERE username = ? LIMIT 1",
    [username],
    (err, rows) => {
      if (err) {
        console.error("DB error during admin signin:", err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }

      if (rows.length === 0) {
        // no such username
        return res
          .status(400)
          .json({ ok: false, message: "Username does not exist" });
      }

      const admin = rows[0];

      // Compare plain password with stored hash
      bcrypt.compare(password, admin.password_hash, (err, match) => {
        if (err) {
          console.error("bcrypt compare error:", err);
          return res
            .status(500)
            .json({ ok: false, message: "Could not verify password" });
        }

        if (!match) {
          return res
            .status(400)
            .json({ ok: false, message: "Password incorrect" });
        }

        // SUCCESS: return minimal admin info (no tokens)
        return res.json({
          ok: true,
          id: admin.id,
          username: admin.username,
        });
      });
    }
  );
});

// ====================
// CONTACTS
// ====================

// Save contact form submission
app.post("/api/contacts", (req, res) => {
  const { name, email, subject, message, project_details } = req.body;

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ ok: false, message: "Missing required fields" });
  }

  const sql = `
    INSERT INTO contacts (name, email, subject, message, project_details)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(
    sql,
    [name, email, subject, message, project_details || null],
    (err, result) => {
      if (err) {
        console.error("Error inserting contact:", err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }

      res.json({ ok: true, id: result.insertId });
    }
  );
});

// ====================
// PROFILE (ABOUT PAGE)
// ====================

// Get all about page data
app.get("/api/profile", (req, res) => {
  const queries = {
    profile: "SELECT * FROM profile LIMIT 1",
    skills: "SELECT * FROM skills ORDER BY category, sort_order ASC",
    experience: "SELECT * FROM experience ORDER BY sort_order ASC",
    education: "SELECT * FROM education ORDER BY sort_order ASC",
    interests: "SELECT * FROM interests LIMIT 1"
  };

  const results = {};
  let completed = 0;
  const total = Object.keys(queries).length;

  Object.entries(queries).forEach(([key, sql]) => {
    db.query(sql, (err, rows) => {
      if (err) {
        console.error(`Error fetching ${key}:`, err);
        return res.status(500).json({ ok: false, message: "DB error" });
      }
      results[key] = rows;
      completed++;
      
      if (completed === total) {
        // Format skills by category
        const skillsByCategory = {
          programming: [],
          tools: [],
          professional: []
        };
        results.skills.forEach(skill => {
          if (skillsByCategory[skill.category]) {
            skillsByCategory[skill.category].push(skill.skill_name);
          }
        });

        res.json({
          profile: results.profile[0] || {},
          skills: skillsByCategory,
          experience: results.experience,
          education: results.education,
          interests: results.interests[0]?.content || ""
        });
      }
    });
  });
});

// PUT /api/profile -> update profile info (admin only)
app.put("/api/profile", (req, res) => {
  const { full_name, bio, philosophy, photo_url } = req.body;

  const sql = `
    UPDATE profile 
    SET full_name = ?, bio = ?, philosophy = ?, photo_url = ?
    WHERE id = 1
  `;

  db.query(sql, [full_name, bio, philosophy, photo_url], (err) => {
    if (err) {
      console.error("Error updating profile:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});

// POST /api/skills -> add a skill (admin only)
app.post("/api/skills", (req, res) => {
  const { category, skill_name, sort_order } = req.body;

  const sql = `
    INSERT INTO skills (category, skill_name, sort_order)
    VALUES (?, ?, ?)
  `;

  db.query(sql, [category, skill_name, sort_order ?? 0], (err, result) => {
    if (err) {
      console.error("Error adding skill:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true, id: result.insertId });
  });
});

// DELETE /api/skills/:id -> delete a skill (admin only)
app.delete("/api/skills/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM skills WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting skill:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});

// POST /api/experience -> add experience (admin only)
app.post("/api/experience", (req, res) => {
  const { title, company, period, description, sort_order } = req.body;

  const sql = `
    INSERT INTO experience (title, company, period, description, sort_order)
    VALUES (?, ?, ?, ?, ?)
  `;

  db.query(sql, [title, company, period, description, sort_order ?? 0], (err, result) => {
    if (err) {
      console.error("Error adding experience:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true, id: result.insertId });
  });
});

// PUT /api/experience/:id -> update experience (admin only)
app.put("/api/experience/:id", (req, res) => {
  const { id } = req.params;
  const { title, company, period, description, sort_order } = req.body;

  const sql = `
    UPDATE experience
    SET title = ?, company = ?, period = ?, description = ?, sort_order = ?
    WHERE id = ?
  `;

  db.query(sql, [title, company, period, description, sort_order, id], (err) => {
    if (err) {
      console.error("Error updating experience:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});

// DELETE /api/experience/:id -> delete experience (admin only)
app.delete("/api/experience/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM experience WHERE id = ?", [id], (err) => {
    if (err) {
      console.error("Error deleting experience:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});

// PUT /api/education/:id -> update education (admin only)
app.put("/api/education/:id", (req, res) => {
  const { id } = req.params;
  const { school, degree, period, coursework } = req.body;

  const sql = `
    UPDATE education
    SET school = ?, degree = ?, period = ?, coursework = ?
    WHERE id = ?
  `;

  db.query(sql, [school, degree, period, coursework, id], (err) => {
    if (err) {
      console.error("Error updating education:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});

// PUT /api/interests -> update interests (admin only)
app.put("/api/interests", (req, res) => {
  const { content } = req.body;

  const sql = `
    UPDATE interests SET content = ? WHERE id = 1
  `;

  db.query(sql, [content], (err) => {
    if (err) {
      console.error("Error updating interests:", err);
      return res.status(500).json({ ok: false, message: "DB error" });
    }
    res.json({ ok: true });
  });
});

app.listen(8080, () => {
  console.log('DevFolio server listening on port 8080');
});
