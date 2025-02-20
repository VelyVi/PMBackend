import express, { Router } from "express";
import helmet from "helmet";
import hpp from "hpp";
import morgan from "morgan";
import cors from "cors"; // Importar el paquete cors

interface Option {
  port: number;
  routes: Router;
}

export class Server {
  private readonly app = express();
  private readonly port: number;
  private readonly routes: Router;

  constructor(options: Option) {
    this.port = options.port;
    this.routes = options.routes;
  }

  async start() {
    // Middlewares
    this.app.use(express.json()); // Para parsear el cuerpo de las solicitudes como JSON
    this.app.use(express.urlencoded({ extended: true })); // Para parsear datos de formularios

    // Configuración de CORS
    this.app.use(
      cors({
        origin: "http://localhost:5173", // Permitir solicitudes desde este origen (tu frontend)
        credentials: true, // Permitir credenciales (cookies, tokens)
      })
    );

    // Middlewares de seguridad
    this.app.use(morgan("dev")); // Logger para desarrollo
    this.app.use(hpp()); // Protección contra parámetros contaminados
    this.app.use(helmet()); // Seguridad adicional para encabezados HTTP

    // Rutas
    this.app.use(this.routes);

    // Iniciar el servidor
    this.app.listen(this.port, () => {
      console.log(`Server started on port ${this.port} 🫠`);
    });
  }
}