# Reflexión - Lab Testing Movie API

## 1. ¿Qué ventaja tiene escribir los tests ANTES de la implementación? Describe una situación donde haberlos escrito después habría escondido un bug.

Escribir los tests primero (TDD) obliga a definir el comportamiento esperado basándote en los requisitos de negocio, no en tu código. Si escribes el test después, podrías adaptar la prueba para que pase con una lógica que ya está mal programada (falsos positivos), escondiendo casos límite que olvidaste contemplar en la implementación.

## 2. ¿Por qué usamos una base de datos de test separada en lugar de mockear el módulo db? ¿Cuándo sí tendría sentido mockear?

Usamos una base de datos real (Test de Integración) para asegurar que las restricciones de PostgreSQL, como claves foráneas o borrados en cascada, realmente funcionan. Mockear tiene sentido en "Tests Unitarios" puros donde solo quieres evaluar la lógica matemática o condicional de una función sin depender de servicios externos.

## 3. ¿Qué es el error de PostgreSQL con código 23505 y por qué lo capturamos específicamente?

El código `23505` corresponde a una "Violación de restricción de unicidad" (Unique Violation) en PostgreSQL. Lo capturamos específicamente para detectar cuándo un usuario intenta añadir una película que ya existe en sus favoritos, permitiéndonos transformar ese fallo de base de datos en una respuesta HTTP 409 (Conflict) amigable para el cliente.
