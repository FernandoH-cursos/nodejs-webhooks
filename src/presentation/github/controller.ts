import { Request, Response } from "express";
import { GithubService } from "../service/github.service";
import { DiscordService } from "../service/discord.service";

export class GithubController {
  constructor(
    private readonly githubService = new GithubService(),
    private readonly discordService = new DiscordService()
  ) {}

  webhookHandler = (req: Request, res: Response) => {
    //* Este header es enviado por Github y contiene la firma del payload del webhook
    const signature = req.header("x-hub-signature") ?? "unknown";
    //* Este header es enviado por Github y contiene el tipo de evento que se está recibiendo(como push, pull_request, etc.)
    const githubEvent = req.header("x-github-event") ?? "unknown";
    //* Recibe el body del webhook de Github
    const payload = req.body;

    let message: string;

    //* Mostrando mensaje dependiendo del evento que se reciba
    switch (githubEvent) {
      case "star":
        message = this.githubService.onStart(payload);
        break;
      case "issues":
        message = this.githubService.onIssue(payload);
        break;
      default:
        message = `Unknown event ${githubEvent}`;
    }

    //* Notificando el mensaje a Discord 
    console.log({message});
    this.discordService
      .notify(message)
      .then((success) => res.status(202).send("Accepted!"))
      .catch((err) =>  res.status(500).json({error: "Internal Server Error"}));
  };
}
