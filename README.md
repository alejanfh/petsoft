# Petsoft

Petsoft es una aplicación web diseñada para gestionar una tienda de mascotas en línea. Permite a los usuarios explorar una variedad de productos para mascotas, agregarlos al carrito de compras y realizar pedidos de manera segura. Este proyecto se basa en el curso de React y Next.js de ByteGrad.

---

## Demo

¡Puedes ver una demostración en vivo del proyecto desplegado [aquí](https://petsoft-omega.vercel.app)!

---

## Tecnologías Utilizadas

- **Next.js:** Framework de React para la construcción de aplicaciones web.
- **React:** Biblioteca de JavaScript para la creación de interfaces de usuario.
- **TypeScript:** Superset de JavaScript que agrega tipado estático opcional.
- **Tailwind CSS:** Framework de diseño CSS utilitario para crear interfaces de usuario rápidas y personalizables.
- **NextAuth:** Biblioteca de autenticación para Next.js que proporciona autenticación fácil y segura.
- **Prisma:** ORM (Object-Relational Mapping) para bases de datos SQL y NoSQL.
- **Shadcn-UI:** Biblioteca de componentes de interfaz de usuario para React.
- **Stripe:** Plataforma de pagos en línea para aceptar pagos y administrar transacciones financieras.
- **Zod:** Biblioteca de validación de esquemas para TypeScript y JavaScript.

---

## Instalación

1. Clona este repositorio en tu máquina local.
2. Navega hasta el directorio del proyecto.
3. Instala las dependencias utilizando npm o yarn:

   ```bash
   npm install
   # o
   yarn install
   ```

4. Crea un archivo .env.local en la raíz del proyecto y configura las variables de entorno necesarias según el archivo .env.example.
5. Ejecuta el servidor de desarrollo:

   ```bash
   npm run dev
   # o
   yarn dev
   ```

6. Abre tu navegador y ve a http://localhost:3000 para ver la aplicación en funcionamiento.

## Variables de Entorno (.env)

Asegúrate de configurar correctamente las variables de entorno en tu entorno local y de producción. Aquí está un ejemplo de cómo podría ser un archivo `.env`:

```plaintext
# Base de Datos PostgreSQL
POSTGRES_URL="postgresql://username:password@hostname:port/database"
POSTGRES_USER="username"
POSTGRES_HOST="hostname"
POSTGRES_PASSWORD="password"
POSTGRES_DATABASE="database"

# URL de la Base de Datos SQLite para desarrollo local
DATABASE_URL="file:./dev.db"

# Secreto de Autenticación
AUTH_SECRET="tu_secreto_de_autenticacion"

# Claves de Stripe para Pagos en Línea
STRIPE_PUBLIC_KEY="tu_clave_publica_de_stripe"
STRIPE_SECRET_KEY="tu_clave_secreta_de_stripe"
STRIPE_WEBHOOK_SECRET="tu_secreto_de_webhook_de_stripe"
STRIPE_PRICE_ID="identificador_de_precio_de_stripe"

# URL Canónica de la Aplicación
CANONICAL_URL="http://localhost:3000"
```
