import { Router } from "express";
import { connectDb } from "../../config/db.js";
import User from "./model.js";
import bcrypt from "bcryptjs";

const router = Router();
const bcryptSalt = bcrypt.genSaltSync();

router.get("/", async (req, res) => {
  connectDb();

  try {
    const user = await User.find();
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: "Erro ao buscar usuários" });
  }
});

router.post("/", async (req, res) => {
  connectDb();

  const { name, email, password } = req.body;
  const encryptedPassword = bcrypt.hashSync(password, bcryptSalt);

  try {
    const newUser = await User.create({
      name,
      email,
      password: encryptedPassword,
    });
    res.json(newUser);
  } catch (error) {
    res.status(400).json({ error: "Erro ao criar usuário" });
  }
});

export default router;
