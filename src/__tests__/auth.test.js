const request = require("supertest");
const app = require("../../index");
const { crearUsuario } = require("./helpers");

describe("POST /api/auth/registro - Validaciones de Login Parametrizadas", () => {
  const casosDeFallo = [
    {
      descripcion: "falta el nombre",
      payload: { email: "test@test.com", password: "password123" },
      statusEsperado: 400,
    },
    {
      descripcion: "email sin @",
      payload: { nombre: "Noah", email: "testtest.com", password: "123456789" },
      statusEsperado: 400,
    },
    {
      descripcion: "password demasiado corta",
      payload: { nombre: "Noah", email: "test@test.com", password: "123" }, // Suponiendo que exiges un mínimo de caracteres
      statusEsperado: 400,
    },
    {
      descripcion: "faltan todos los campos",
      payload: {},
      statusEsperado: 400,
    },
  ];

  it.each(casosDeFallo)(
    "debe fallar con $statusEsperado si el $descripcion",
    async ({ payload, statusEsperado }) => {
      const res = await request(app).post("/api/auth/registro").send(payload);

      expect(res.status).toBe(statusEsperado);
    },
  );
});
