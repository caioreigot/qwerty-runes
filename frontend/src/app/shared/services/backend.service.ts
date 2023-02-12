import { GeneralKnowledgeQuestionType } from './../../core/models/GeneralKnowledgeQuestionType';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendService {
  
  endpoints = {
    user: {
      login: 'user/login',
      loginWithToken: 'user/token-login',
      create: 'user/create',
      isAdmin: 'user/is-admin'
    },
    generalKnowledge: {
      add: 'general-knowledge/add'
    }
  } 

  constructor(private http: HttpClient) {}

  createUser(nickname: string, password: string) {
    const body = { nickname, password };
    return this.http.post(this.endpoints.user.create, body);
  }

  login(nickname: string, password: string, remember: boolean) {
    const body = { nickname, password, remember };
    return this.http.post(this.endpoints.user.login, body);
  }

  useTokenToValidateAuthentication(): Observable<void | HttpErrorResponse> {
    return this.http.get<void | HttpErrorResponse>(this.endpoints.user.loginWithToken);
  }

  isUserAdmin(): Observable<boolean> {
    return this.http.get<boolean>(this.endpoints.user.isAdmin);
  }

  addGeneralKnowledge(
    questionTitle: string,
    type: GeneralKnowledgeQuestionType,
    content: any
  ) {
    return this.http.post(this.endpoints.generalKnowledge.add, {
      questionTitle,
      type,
      content
    });
  }
}
