import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { NgxMaskDirective } from 'ngx-mask';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CepService } from '../../services/cep.service';
import {
  FormBuilder,
  ReactiveFormsModule,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { CEP } from '../../interfaces/cep';
import emailjs, { type EmailJSResponseStatus } from '@emailjs/browser';

@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgxMaskDirective,
    MatInputModule,
    MatDatepickerModule,
    MatFormFieldModule,
  ],
  providers: [provideNativeDateAdapter()],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.scss',
})
export class MenuComponent implements OnInit {
  form!: UntypedFormGroup;
  cepValido = false;
  cepManual = false;

  pagina = 0;
  quantidadeDePaginas = 2;

  constructor(private fb: FormBuilder, private cepSerivce: CepService) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      nome: ['', Validators.required],
      data: ['', Validators.required],
      celular: ['', Validators.required],
      email: ['', Validators.required],
      cep: [null, Validators.required],
      bairro: null,
      endereco: [null, [Validators.required]],
      cidade: null,
      estado: null,
      numero: [null, Validators.required],
      complemento: null,
    });
    this.desabilitarCamposDeEndereco();
  }

  buscarCep() {
    this.cepSerivce.buscarCEP(this.form.get('cep')!.value).subscribe({
      next: (res: CEP) => {
        this.form.get('bairro')?.setValue(res.bairro);
        this.form.get('endereco')?.setValue(res.logradouro);
        this.form.get('cidade')?.setValue(res.localidade);
        this.form.get('estado')?.setValue(res.uf);
        this.cepValido = true;
        this.habilitarDadosCasa();
      },
      error: () => {
        this.cepValido = false;
        this.desabilitarCamposDeEndereco();
      },
    });
  }

  alterarCep() {
    const cep = this.form.get('cep')!.value as string;
    if (this.cepValido && cep.length < 8) {
      this.cepValido = false;
      this.limparCamposDeEndereco();
      this.desabilitarCamposDeEndereco();
    }
  }

  habilitarDesabilitarCepManual() {
    this.cepManual = !this.cepManual;
    this.form.get('cep')?.setValue(null);
    this.limparCamposDeEndereco();
    if (this.cepManual) {
      this.form.get('cep')?.disable();
      this.habilitarCamposDeEndereco();
    } else {
      this.form.get('cep')?.enable();
      this.desabilitarCamposDeEndereco();
    }
  }

  desabilitarCamposDeEndereco() {
    this.form.get('bairro')?.disable();
    this.form.get('endereco')?.disable();
    this.form.get('cidade')?.disable();
    this.form.get('estado')?.disable();
    this.form.get('numero')?.disable();
    this.form.get('complemento')?.disable();
  }

  habilitarCamposDeEndereco() {
    this.form.get('bairro')?.enable();
    this.form.get('endereco')?.enable();
    this.form.get('cidade')?.enable();
    this.form.get('estado')?.enable();
    this.habilitarDadosCasa();
  }

  habilitarDadosCasa() {
    this.form.get('numero')?.enable();
    this.form.get('complemento')?.enable();
  }

  limparCamposDeEndereco() {
    this.form.get('bairro')?.setValue(null);
    this.form.get('endereco')?.setValue(null);
    this.form.get('cidade')?.setValue(null);
    this.form.get('estado')?.setValue(null);
    this.form.get('numero')?.setValue(null);
    this.form.get('complemento')?.setValue(null);
  }

  proximaPagina() {
    this.pagina++;
  }

  voltarPagina() {
    this.pagina--;
  }

  sendEmail() {
    emailjs.init('_ZXy8aiWhIbtoO5TM');
    emailjs
      .send('service_ab379ki', 'template_76zyotp', {
        from_name: 'teste',
        to_name: 'teste',
        message: 'teste',
        reply_to: 'teste',
      })
      .then(() => {
        console.log('mensagem enviada');
      });
  }

  get porcentagemAtual() {
    return (this.pagina / this.quantidadeDePaginas) * 100;
  }
}
