import { GeneralKnowledgeQuestionType } from '../../core/models/GeneralKnowledgeQuestionType';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class BackendService {
  
  endpoints = {
    user: {
      login: 'user/login',
      loginWithToken: 'user/token-login',
      create: 'user/create',
      isAdmin: 'user/is-admin',
      getAllAdminNicknames: 'user/get-all-admin-nicknames',
      removeAdmin: 'user/remove-admin',
      addAdmin: 'user/add-admin',
    },
    generalKnowledge: {
      add: 'general-knowledge/add',
      getUnapprovedQuestion: 'general-knowledge/get-unapproved-question',
    }
  } 

  constructor(private http: HttpClient) {}

  createUser(nickname: string, password: string) {
    const body = { nickname, password };
    return this.http.post(this.endpoints.user.create, body);
  }

  login(nickname: string, password: string, remember: boolean): Observable<object> {
    const body = { nickname, password, remember };
    return this.http.post(this.endpoints.user.login, body);
  }

  useTokenToValidateAuthentication(): Observable<void> {
    return this.http.get<void>(this.endpoints.user.loginWithToken);
  }

  isUserAdmin(): Observable<boolean> {
    return this.http.get<boolean>(this.endpoints.user.isAdmin);
  }

  getAllAdminNicknames(): Observable<string[]> {
    return this.http.get<string[]>(this.endpoints.user.getAllAdminNicknames);
  }
  
  addAdmin(nickname: string): Observable<{ nickname: string }> {
    const body = { nickname };
    return this.http.post<{ nickname: string }>(this.endpoints.user.addAdmin, body);
  }

  removeAdmin(nickname: string): Observable<{ nickname: string }> {
    const body = { nickname };
    return this.http.post<{ nickname: string }>(this.endpoints.user.removeAdmin, body);
  }

  addGeneralKnowledge(
    questionTitle: string,
    type: GeneralKnowledgeQuestionType,
    content: any,
    acceptableAnswers: string,
  ): Observable<void> {
    return this.http.post<void>(this.endpoints.generalKnowledge.add, {
      questionTitle,
      acceptableAnswers,
      type,
      content
    });
  }

  getGeneralKnowledgeUnapprovedQuestion(): Observable<object> {
    return this.http.get<object>(this.endpoints.generalKnowledge.getUnapprovedQuestion);
  }
}
