import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/api-service.service'; 
import { PoNotificationService } from '@po-ui/ng-components';



@Component({
  selector: 'app-eleicao-cipa',
  templateUrl: './eleicao-cipa.component.html',
  styleUrls: ['./eleicao-cipa.component.css'],
  providers: [PoNotificationService]
})
export class EleicaoCipaComponent {
  eleicaoForm: FormGroup;
  isHideLoading: boolean = true;
  botaoHabilitado: boolean = false;
  date = new Date();
  anoCorrente = this.date.getFullYear();
  anoSeguinte =  this.anoCorrente + 1; 

  constructor(private formBuilder: FormBuilder, private apiService: ApiService, private poNotification: PoNotificationService) {
    this.eleicaoForm = this.formBuilder.group({
      matricula: ['', Validators.required],
      nomeCandidato: ['', Validators.required],
      cargo: ['', Validators.required],
      telefone: ['', Validators.required],
      data: ['', Validators.required]
    });
  }

  preencherCamposAutomaticamente(): void {
    const matriculaControl = this.eleicaoForm.get('matricula');
    if (matriculaControl?.value) {
      const matricula = matriculaControl.value;
      this.isHideLoading = false;
      this.apiService.getColaborador(matricula).subscribe({
        next: (colaborador) => {
          this.eleicaoForm.patchValue({
            nomeCandidato: colaborador.nome,
            cargo: colaborador.cargo,
            telefone: colaborador.telefone,
            data: colaborador.data
          });
          this.isHideLoading = true;
          this.botaoHabilitado = true
        },
        error: (error) => {
          this.isHideLoading = true;
          this.limparCampos();
        }
      });
    }
  }
  
  limparCampos():void{
    this.botaoHabilitado = false;
    this.eleicaoForm.patchValue({
      matricula: "",
      nomeCandidato: "",
      cargo: "",
      telefone: "",
      data: ""
    });
  }
  
  finalizarInscricao(): void {
    const matriculaControl = this.eleicaoForm.get('matricula');
    const dataControl = this.eleicaoForm.get('data');

    if (matriculaControl && dataControl) {
      const matricula = matriculaControl.value;
      const data = dataControl.value;

      if (matricula && data) {
        this.isHideLoading = false;  
        this.apiService.atualizarData(matricula, data).subscribe({
          next: (response) => {
            this.limparCampos();
            this.isHideLoading = true;
            this.poNotification.success(response);
          }, 
          error: (error) => {
            this.limparCampos();  
            this.isHideLoading = true;
            this.poNotification.error('Ocorreu um erro ao finalizar a inscrição.');
          }
        });
      }
    }
  }
}
