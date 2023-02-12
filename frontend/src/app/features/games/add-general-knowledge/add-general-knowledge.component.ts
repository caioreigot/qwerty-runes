import { GeneralKnowledgeQuestionType } from './../../../core/models/GeneralKnowledgeQuestionType';
import { BehaviorSubject, Observable } from 'rxjs';
import { SnackbarService } from './../../../shared/services/snackbar.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { BackendService } from 'src/app/shared/services/backend.service';

@Component({
  selector: 'app-add-general-knowledge',
  templateUrl: './add-general-knowledge.component.html',
  styleUrls: ['./add-general-knowledge.component.less']
})
export class AddGeneralKnowledgeComponent implements AfterViewInit {
  
  @ViewChild('form')
  form: ElementRef<HTMLFormElement> | null = null;

  @ViewChild('questionInput')
  questionInput: ElementRef<HTMLInputElement> | null = null;
  
  @ViewChild('fileInput')
  fileInput: ElementRef<HTMLInputElement> | null = null;

  @ViewChild('image')
  image: ElementRef<HTMLImageElement> | null = null;

  @ViewChild('textArea')
  textArea: ElementRef<HTMLTextAreaElement> | null = null;

  @ViewChild('typeOfQuestion')
  typeOfQuestionInput: ElementRef<HTMLInputElement> | null = null;

  imageBase64: string | null = null;

  private _isImageQuestionSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  isImageQuestion: Observable<boolean> = this._isImageQuestionSubject.asObservable();

  constructor(
    private backendService: BackendService,
    private snackbarService: SnackbarService,
  ) {}

  ngAfterViewInit(): void {
    const form = this.form?.nativeElement;
    if (!form) return;

    const fileInput = this.fileInput?.nativeElement!;

    fileInput.onchange = () => {
      const file = fileInput.files?.[0];

      if (!file) {
        this.snackbarService.showMessage('Nenhuma imagem selecionada.', true);
        return;
      }

      if (file.size > 1 * 1024 * 1024) {
        this.snackbarService.showMessage('Imagens maiores que 1mb não podem ser enviadas.', true);
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
    
    form.onsubmit = (event) => {
      event.preventDefault();
      
      const typeOfQuestion = this.typeOfQuestionInput?.nativeElement.value as GeneralKnowledgeQuestionType;
      const questionTitle = this.questionInput?.nativeElement.value;
      const content = this.textArea?.nativeElement.value;
      
      // Se o título da pergunta estiver vazio ou o tipo da pergunta não for uma imagem e não houver um conteúdo
      if (!questionTitle || (typeOfQuestion !== GeneralKnowledgeQuestionType.image && !content)) {
        this.snackbarService.showMessage('Por favor, preencha todos os campos.', true);
        return;
      }

      this.backendService.addGeneralKnowledge(
        questionTitle,
        typeOfQuestion,
        typeOfQuestion === GeneralKnowledgeQuestionType.image 
          ? this.imageBase64
          : content
      ).subscribe(() => {
        this.snackbarService.showMessage('Dados enviados com sucesso! Obrigado pela contribuição.');
      });
    }

    this.typeOfQuestionInput?.nativeElement.addEventListener('change', (e) => {
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
