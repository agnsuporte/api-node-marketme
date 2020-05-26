const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const connect = require("../database/connect");
const dtime = require("../utilities/format-date");

const lastlogin = async (id) => {
  const login_time = dtime.time();
  const last_login = dtime.timestampString();

  try {
    await connect("users").where("id", id).update({ last_login, login_time });
  } catch (err) {
    console.table("UPDATE-LAST-LOGIN", err);
    return { erro: "Ocorreu um erro inespedo." };
  }

  return { erro: "" };
};

module.exports = {
  async index(request, response) {
    const users = await connect("users").select("*").orderBy("id");

    return response.json(users);
  },

  async sign(request, response) {
    const message = "Verifique suas credencias";
    const { email, password } = request.body;
    const user = await connect("users")
      .where("email", email)
      .select("id", "username", "password")
      .first();

    if (!user) {
      return response.status(401).json({ erro: message });
    }

    const check = bcrypt.compareSync(password, user.password);

    if (check) {
      const id = user.id;
      const username = user.username;
      const token = jwt.sign(
        { id, username, email, secret: process.env.JWT_SECRET_PRIVATE_KEY },
        process.env.JWT_SECRET_PRIVATE_KEY,
        { expiresIn: '1h' }
      );

      const last_login = await lastlogin(id).then();
      const data = { id, username, token, email, last_login, erro: "" };

      return response.status(200).json(data);
    }

    return response.status(401).json({ erro: message });
  },

  async create(request, response) {
    let message = "";

    const { username, email, password } = request.body;
    const created_on = dtime.timestampString();
    const last_login = dtime.timestampString();
    const login_time = dtime.time();
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const data = {
      username,
      email,
      password: hash,
      created_on,
      last_login,
      login_time,
    };

    try {
      await connect("users").insert(data);
    } catch (err) {
      const constraint = err.constraint;

      if (constraint === "users_username_key") {
        message = "Já existe uma conta com este usuário.";
      }

      if (constraint === "users_email_key") {
        message = "Já existe uma conta com este E-mail.";
      }

      return response.status(401).json({ erro: message });
    }

    return response.status(200).json({ user: username, email, erro: message });
  },

  async delete(request, response) {
    const { id } = request.params;
    const token = request.headers.authorization;

    if (!token) {
      return response.status(401).json({ erro: "Operação não permitida" });
    }

    try {
      await connect("users").where("id", id).delete();
    } catch (err) {
      console.table("DELETE:", err);
      return response.status(401).json({ erro: "Ocorreu um erro inesperado" });
    }

    return response.status(204).json({ message: "Usuário excluído", erro: "" });
  },

  async update(request, response) {
    const { id } = request.params;
    const { username } = request.body;
    const last_login = dtime.timestampString();
    const token = request.headers.authorization;

    if (!token) {
      return response.status(401).json({ message: "Operação não permitida" });
    }

    try {
      await connect("users").where("id", id).update({ username, last_login });
    } catch (err) {
      const constraint = err.constraint;
      let message = "Ocorreu um erro inespedo.";

      if (constraint === "users_username_key") {
        message = "Já existe uma conta com este usuário";
      }

      return response.status(401).json({ erro: message });
    }

    return response.status(200).json({ username, erro: "" });
  },

  async validToken(request, response) {
    let valided = false;
    const { token } = request.body;
    const secret = process.env.JWT_SECRET_PRIVATE_KEY

    valided = jwt.verify(
      token,
      secret,
      (err, decoded) => {
        if (err) {
          if (err.name === "TokenExpiredError") return false;
        }
        return true;
      }
    );

    return response.status(202).json({ verify: valided });
  },
};
