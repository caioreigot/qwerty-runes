import { SnackbarService } from './../../../shared/services/snackbar.service';
import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-add-general-knowledge',
  templateUrl: './add-general-knowledge.component.html',
  styleUrls: ['./add-general-knowledge.component.less']
})
export class AddGeneralKnowledgeComponent implements AfterViewInit {
  
  @ViewChild('form')
  form: ElementRef<HTMLFormElement> | null = null;
  
  @ViewChild('fileInput')
  fileInput: ElementRef<HTMLInputElement> | null = null;

  @ViewChild('image')
  image: ElementRef<HTMLImageElement> | null = null;

  constructor(private snackbarService: SnackbarService) {}

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

      const blob = this.transformFileToBlob(file);

      // salvar blob no banco de dados

      // converter blob para base 64 e mostrar como uma imagem
      this.blobToBase64(blob)
        .then((base64) => {
          const image = this.image?.nativeElement;
          if (!image) return;

          image.src = base64 as string;
        })
    }
    
    form.onsubmit = (event) => {
      event.preventDefault();
      // TODO
    }
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
