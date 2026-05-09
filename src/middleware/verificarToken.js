const jwt = require("jsonwebtoken");
const AppError = require("../utils/AppError");

const verificarToken = (req, res, next) => {
  try {
    // 1. Buscamos el header (soportando mayúsculas o minúsculas)
    const authHeader = req.headers.authorization || req.headers.Authorization;

    // Si no hay header, o no empieza con "Bearer ", lo echamos.
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError("Token no proporcionado o formato incorrecto", 401);
    }

    // 2. Extraemos el token real separando por el espacio: "Bearer <token>"
    const token = authHeader.split(" ")[1];

    // 3. EL SECRETO: Esto es vital. Debe ser exactamente igual al que usaste
    // en src/__tests__/helpers.js (process.env.JWT_SECRET || 'test-secret')
    const secreto = process.env.JWT_SECRET || "test-secret";

    // 4. Verificamos la validez. Si falla, jsonwebtoken lanza un error y saltamos al catch.
    const decoded = jwt.verify(token, secreto);

    // 5. Si es válido, guardamos los datos y dejamos pasar a la ruta
    req.usuario = decoded;
    next();
  } catch (error) {
    // Aquí interceptamos los errores específicos de la librería jsonwebtoken
    if (error.name === "TokenExpiredError") {
      return next(new AppError("Token expirado", 401)); // Lo que espera el test
    }

    // Si la firma no coincide o el token está corrupto:
    return next(new AppError("Token inválido", 401));
  }
};

module.exports = verificarToken;
