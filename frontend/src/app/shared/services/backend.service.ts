import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeneralKnowledgeQuestionType } from '../../core/models/general-knowledge-question-type';
import { GeneralKnowledgeQuestion } from '../../core/models/general-knowledge-question';

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
      approveQuestion: 'general-knowledge/approve-question',
      rejectQuestion: 'general-knowledge/reject-question',
    }
  } 

  constructor(private http: HttpClient) {}

  createUser(nickname: string, password: string): Observable<any> {
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

  getGeneralKnowledgeUnapprovedQuestion(): Observable<GeneralKnowledgeQuestion> {
    return this.http.get<GeneralKnowledgeQuestion>(this.endpoints.generalKnowledge.getUnapprovedQuestion);
  }

  approveQuestion(
    questionId: number,
    changes: Partial<GeneralKnowledgeQuestion>
  ): Observable<GeneralKnowledgeQuestion> {
    const body = { id: questionId, changes };
    return this.http.post<GeneralKnowledgeQuestion>(this.endpoints.generalKnowledge.approveQuestion, body);
  }

  rejectQuestion(questionId: number) {
    const body = { id: questionId };
    return this.http.post<GeneralKnowledgeQuestion>(this.endpoints.generalKnowledge.rejectQuestion, body);
  }
}
