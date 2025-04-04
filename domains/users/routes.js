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

router.post("/login", async (req, res) => {
  connectDb();

  const { email, password } = req.body;
  try {
    /* Verifica se o usuário existe */
    const user = await User.findOne({ email });
    if (!user) {
      return res
        .status(401)
        .json({ error: "Acesso negado: Usuário não encontrado!" });
    }

    const { _id, name } = user;

    // Testa se a senha bate
    const passwordMatch = bcrypt.compareSync(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: "Acesso negado: Senha incorreta!" });
    }

    /* Caso der tudo certo, retorna o usuário */
    res.json({ _id, name, email });
  } catch (error) {
    res.status(404).json({ error: "Erro ao buscar usuário" });
  }
});

export default router;
