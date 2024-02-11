import express from 'express';
import { envs } from './config';
import { GithubController } from './presentation/github/controller';
import { GithubSha256Middleware } from './presentation/middlewares/github-sha256.middleware';

(() => {
  main();
 })();

function main() {
  const app = express();

  const githubController = new GithubController();
  //* Middleware que permite parsear el body del webhook de Github a JSON y no devuelva undefined 
  app.use(express.json());
  //* Middleware que verifica la firma del payload del webhook de Github para asegurar que sea un evento válido
  app.use(GithubSha256Middleware.verifySignature)
   
  app.post('/api/github', githubController.webhookHandler)

  app.listen(envs.PORT, () => {
    console.log(`App running on port ${envs.PORT}`);
  });
}