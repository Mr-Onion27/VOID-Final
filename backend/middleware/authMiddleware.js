import jwt from "jsonwebtoken";

// Protect Student
export const protectStudent = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No student token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_STUDENT);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid student token" });
  }
};

// Protect Faculty
export const protectFaculty = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No faculty token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_FACULTY);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid faculty token" });
  }
};

// Protect Admin
export const protectAdmin = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).json({ message: "No admin token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_ADMIN);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid admin token" });
  }
};
