const request = require("supertest");
const app = require("../../index");
const { crearPelicula } = require("./helpers");

describe("Flujo de Integración Completo (User Journey)", () => {
  it("debe registrarse, loguearse y gestionar sus favoritos exitosamente", async () => {
    // ---------------------------------------------------------
    // 1. PREPARACIÓN (SETUP)
    // ---------------------------------------------------------
    // Creamos una película directamente en la DB para tener algo que añadir
    const pelicula = await crearPelicula({ titulo: "Interstellar" });

    // Datos simulados que enviaría el frontend en un formulario
    const datosUsuario = {
      nombre: "Noah Test",
      email: "noah.integration@test.com",
      password: "MiPasswordSeguro123",
    };

    let tokenUsuario;

    // 2. REGISTRO (Simulando POST /api/auth/registro)

    const resRegistro = await request(app)
      .post("/api/auth/registro")
      .send(datosUsuario);

    // Dependiendo de tu lab anterior, esto devuelve 201 o 200
    expect(resRegistro.status).toBe(201);

    // 3. LOGIN (Simulando POST /api/auth/login)
    const resLogin = await request(app)
      .post("/api/auth/login")
      .send({ email: datosUsuario.email, password: datosUsuario.password });

    expect(resLogin.status).toBe(200);
    expect(resLogin.body).toHaveProperty("token");

    //Capturamos el token del usuario
    tokenUsuario = resLogin.body.token;

    // 4. AÑADIR A FAVORITOS
    const favoritos = await request(app)
      .post(`/api/favoritos/${pelicula.id}`)
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(favoritos.status).toBe(201);

    // 5. LISTAR FAVORITOS
    const listFavs = await request(app)
      .get("/api/favoritos")
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(listFavs.status).toBe(200);
    expect(listFavs.body.length).toBe(1);

    // 6. ELIMINAR DE FAVORITOS
    const delFavoritos = await request(app)
      .delete(`/api/favoritos/${pelicula.id}`)
      .set("Authorization", `Bearer ${tokenUsuario}`);

    expect(delFavoritos.status).toBe(200);
  });
});
