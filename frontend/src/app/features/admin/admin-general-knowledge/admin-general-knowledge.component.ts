import { Component, ElementRef, ViewChild, AfterViewInit } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BackendService } from '../../../shared/services/backend.service';
import { GeneralKnowledgeQuestion } from '../../../core/models/GeneralKnowledgeQuestion';
import { GeneralKnowledgeQuestionType } from '../../../core/models/GeneralKnowledgeQuestionType';
import { SnackbarService } from '../../../shared/services/snackbar.service';

@Component({
  selector: 'app-admin-general-knowledge',
  templateUrl: './admin-general-knowledge.component.html',
  styleUrls: ['./admin-general-knowledge.component.less']
})
export class AdminGeneralKnowledgeComponent implements AfterViewInit {

  image: ElementRef<HTMLImageElement> | null = null;

  private imageRefLoaded: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @ViewChild('image') set imageRef(imageRef: ElementRef) {
    if (imageRef) {
      this.image = imageRef;
      this.imageRefLoaded.next(true);
    }
  }

  textContentInput: HTMLInputElement | null = null;

  @ViewChild('textContent') set textContentRef(ref: ElementRef<HTMLInputElement>) {
    if (!ref) return;
    this.textContentInput = ref.nativeElement;
  }

  private _haveQuestionToApprove: BehaviorSubject<boolean | null> = new BehaviorSubject<boolean | null>(null);
  haveQuestionToApprove: Observable<boolean | null> = this._haveQuestionToApprove.asObservable();

  private _question: BehaviorSubject<GeneralKnowledgeQuestion | null> = new BehaviorSubject<GeneralKnowledgeQuestion | null>(null);
  question: Observable<GeneralKnowledgeQuestion | null> = this._question.asObservable();

  isButtonsDisabled: boolean = false;

  constructor(
    private backendService: BackendService,
    private snackbarService: SnackbarService
  ) {}

  ngAfterViewInit() {
    this.getUnapprovedQuestionAndSetupPage();
  }

  getUnapprovedQuestionAndSetupPage() {
    this.backendService.getGeneralKnowledgeUnapprovedQuestion()
      .subscribe((question: GeneralKnowledgeQuestion) => {
        // Se não houver uma questão para analisar
        if (!question) {
          this._haveQuestionToApprove.next(false);
          this._question.next(null);
          return;
        }

        this._question.next(question);

        // Se a referência de <img> já estiver carregada, mostre a imagem
        if (this.imageRefLoaded.value) {
          this.setImageSrc(this.image!.nativeElement, question.content);
          return;
        }

        // Caso contrário, observe e mostre a imagem quando estiver carregada
        this.imageRefLoaded.asObservable().subscribe((loaded) => {
          if (!loaded) return;
          this.setImageSrc(this.image!.nativeElement, question.content);
        });
      });
  }

  setImageSrc(image: HTMLImageElement, src: string) {
    image.src = src;
  }

  approve(
    questionId: number,
    type: GeneralKnowledgeQuestionType,
    questionTitle: string,
    acceptableAnswers: string
  ) {
    this.isButtonsDisabled = true;

    const changes: { [key: string]: any } = {
      questionTitle,
      acceptableAnswers
    }
    
    // Se não for uma imagem, passe o content para "changes" também
    if (type !== GeneralKnowledgeQuestionType.IMAGE && this.textContentInput) {
      changes['content'] = this.textContentInput.value;
    }

    this.backendService.approveQuestion(questionId, changes).subscribe({
      next: () => this.getUnapprovedQuestionAndSetupPage(),
      complete: () => this.isButtonsDisabled = false,
      error: () => this.snackbarService.showMessage('Ocorreu um erro inesperado.', true)
    });
  }

  reject(questionId: number) {
    this.isButtonsDisabled = true;

    this.backendService.rejectQuestion(questionId).subscribe({
      next: () => this.getUnapprovedQuestionAndSetupPage(),
      complete: () => this.isButtonsDisabled = false,
      error: () => this.snackbarService.showMessage('Ocorreu um erro inesperado.', true)
    });
  }
}
