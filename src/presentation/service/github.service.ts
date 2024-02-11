import { GithubIssuePayload, GithubStarPayload } from "../../interfaces";

export class GithubService {
  constructor() {}

  onStart(payload: GithubStarPayload) {
    //* 'action' es el tipo de acción que se realizó en el evento, 'sender' es el usuario que realizó la acción y 'repository' es el repositorio en el que se realizó la acción
    const { action,sender,repository } = payload;


    return `User ${sender.login} ${action} star on ${repository.full_name}`;
  }

  onIssue(payload: GithubIssuePayload) {
    let message: string = "";
    //* 'action' es el tipo de acción que se realizó en el evento, 'issue' es el issue que se creó o cerró 
    const { action, issue } = payload;
    
    if (action === "opened") {
      message = `An issue was opened with this title ${issue.title}`;
    }else if (action === "closed") {
      message = `An issue was closed with by ${issue.user.login}`;   
    } else {
      message = `Unhandled action for the issue event ${action}`;
    }

      
    return message;
  }
}
