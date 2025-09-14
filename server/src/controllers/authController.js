import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/generateToken.js";

const prisma = new PrismaClient();

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  const userExists = await prisma.user.findUnique({ where: { email } });
  if (userExists)
    return res.status(400).json({ message: "User already exists" });

  const hashed = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: { username, email, password: hashed },
  });

  res.json({
    id: user.id,
    username: user.username,
    token: generateToken(user.id),
  });
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(400).json({ message: "Invalid credentials" });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.status(400).json({ message: "Invalid credentials" });

  res.json({
    id: user.id,
    username: user.username,
    token: generateToken(user.id),
  });
};
