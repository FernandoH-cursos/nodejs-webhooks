import * as crypto from "crypto";

import { NextFunction, Request, Response } from "express";
import { envs } from "../../config";

//* Secret token que se utiliza para verificar la firma del payload del webhook 
const WEBHOOK_SECRET = envs.SECRET_TOKEN;

const verify_signature = (req: Request) => {
  try {
    //* Creando la firma del payload del webhook
    const signature = crypto
      .createHmac("sha256", WEBHOOK_SECRET)
      .update(JSON.stringify(req.body))
      .digest("hex");

    //* Obteniendo la firma del payload del webhook que envía Github
    const xHubSignature = req.header("x-hub-signature-256") ?? "";

    //* Creando un buffer con la firma que se generó
    let trusted = Buffer.from(`sha256=${signature}`, "ascii");
    //* Creando un buffer con la firma que envía Github
    let untrusted = Buffer.from(xHubSignature, "ascii");

    //* Comparando las firmas que se generaron y la que envía Github para verificar si son iguales
    return crypto.timingSafeEqual(trusted, untrusted);
  } catch (error) {
    return false;
  }
};

export class GithubSha256Middleware {

  static verifySignature(req: Request, res: Response, next: NextFunction) { 
    //* Verificando si la firma del payload del webhook es correcta 
    if (!verify_signature(req)) {
      return res.status(401).send("Unauthorized");
    }

    next();
  }
}