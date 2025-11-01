import jwt from "jsonwebtoken";

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
};

export const auth = (req, res, next) => {
  const token = req.cookies?.jwt;
  if (!token) {
    return res.status(401).json({ message: "Unauthorized" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Unauthorized" });
  }
};

export const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin" && req.user.role !== "superAdmin") {
    return res.status(403).json({ message: "Forbidden: Admins only" });
  }
  next();
};

export const isSuperAdmin = (req, res, next) => {
  if (req.user.role !== "superAdmin") {
    return res.status(403).json({ message: "Forbidden: SuperAdmins only" });
  }
  next();
};
