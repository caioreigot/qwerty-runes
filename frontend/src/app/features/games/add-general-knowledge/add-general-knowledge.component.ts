import { BehaviorSubject, Observable } from 'rxjs';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { SnackbarService } from '../../../shared/services/snackbar.service';
import { BackendService } from '../../../shared/services/backend.service';
import { UtilsService } from '../../../shared/services/utils.service';
import { GeneralKnowledgeQuestionType } from 'src/app/core/models/general-knowledge-question-type';

@Component({
  selector: 'app-add-general-knowledge',
  templateUrl: './add-general-knowledge.component.html',
  styleUrls: ['./add-general-knowledge.component.less']
})
export class AddGeneralKnowledgeComponent implements AfterViewInit {

  @ViewChild('typeOfQuestionSelect')
  typeOfQuestionSelect: ElementRef<HTMLSelectElement> | null = null;

  @ViewChild('image')
  image: ElementRef<HTMLImageElement> | null = null;
  
  @ViewChild('fileInput')
  fileInput: ElementRef<HTMLInputElement> | null = null;

  imageBase64: string | null = null;

  private _isImageQuestionSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isImageQuestion: Observable<boolean> = this._isImageQuestionSubject.asObservable();

  constructor(
    private backendService: BackendService,
    private snackbarService: SnackbarService,
    private utilsService: UtilsService
  ) {}

  onSubmit(
    questionTitle: string,
    typeOfQuestion: string,
    contentTextAreaValue: string,
    acceptableAnswers: string,
  ) {
    const content = typeOfQuestion === GeneralKnowledgeQuestionType.IMAGE 
      ? this.imageBase64
      : contentTextAreaValue

    this.backendService.addGeneralKnowledge(
      questionTitle,
      typeOfQuestion as GeneralKnowledgeQuestionType,
      content,
      acceptableAnswers,
    ).subscribe({
      error: (response) => this.utilsService.handleResponseErrorAndShowInSnackbar(response),
      complete: () => this.snackbarService.showMessage('Dados enviados com sucesso. Obrigado pela contribuição!')
    });
  }

  ngAfterViewInit(): void {
    const fileInput = this.fileInput?.nativeElement!;

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];

      if (!file) {
        this.snackbarService.showMessage('Nenhuma imagem selecionada.', true);
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        this.snackbarService.showMessage('Imagens maiores que 1 MB não podem ser enviadas.', true);
        return;
      }

      const blob = this.transformFileToBlob(file);

      // salvar blob no banco de dados
      // converter blob para base 64 e mostrar como uma imagem
      this.blobToBase64(blob)
        .then((base64) => {
          const image = this.image?.nativeElement;
          if (!image) return;

          this.imageBase64 = base64 as string;
          image.src = base64 as string;
        })
    }
  
    this.typeOfQuestionSelect?.nativeElement.addEventListener('change', (e) => {
      const input = e.target as HTMLInputElement;
      this._isImageQuestionSubject.next(input.value === 'image');
    });
  }

  transformFileToBlob(file: File) {
    return new Blob([file], { type: file.type });
  };

  blobToBase64(blob: Blob): Promise<string | ArrayBuffer | null> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  }
}
