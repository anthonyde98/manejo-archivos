import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { UsuarioService } from 'src/app/services/usuario.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  spinner: boolean = false;
  usuarioForm: FormGroup;
  constructor(private fb: FormBuilder, private usuarioService: UsuarioService, 
    private route: Router, private toastr: ToastrService) {
    this.usuarioForm = this.fb.group({
      correo: ["", [Validators.email, Validators.required]],
      contrasena: ["", [Validators.required, Validators.minLength(6)]]
    })
   }

  ngOnInit(): void {
  }

  iniciarSesion(){
    this.spinner = true;

    if(this.usuarioForm.invalid){
      this.spinner = false;
      return;
    }

    this.usuarioService.iniciarSesion(this.usuarioForm.value).then(() => {
      this.route.navigateByUrl('mis-archivos');
    }).catch((error: any) => {
      this.spinner = false;

      if(error.code == 'auth/user-not-found'){
        this.toastr.error('Este usuario no fue encontrado.', 'Inicio de sesión')
        this.alerta2Color(['red'], ['email', 'pass', 'user']);
        this.turnBlackInTime(['email', 'pass', 'user'], 5000)
      }
      else if(error.code == 'auth/wrong-password'){
        this.toastr.error('Contraseña incorrecta.', 'Inicio de sesión')
        this.alerta2Color(['red'], ['pass']);
        this.turnBlackInTime(['pass'], 5000)
      }
      else if(error.code == 'auth/too-many-requests'){
        this.toastr.warning('El acceso a esta cuenta ha sido temporalmente deshabilitado debido a demasiados intentos fallidos. Espere 1 minuto para intentar de nuevo.',
         'Inicio de sesión', {timeOut: 8000})
         this.alerta2Color(['orange'], ['email', 'pass', 'user']);
         this.turnBlackInTime(['email', 'pass', 'user'], 60000)
      }
      else
        this.toastr.error('Hubo un error al iniciar sesion.', 'Error')
    })
  }

  registrarse(){
    this.spinner = true;

    if(this.usuarioForm.invalid){
      this.spinner = false;
      return;
    }

    this.usuarioService.registarUsuario(this.usuarioForm.value).then(() =>{
      this.route.navigateByUrl('mis-archivos');
    }).catch((error: any) => {
      console.log(error);
      this.spinner = false;
      if(error.code == 'auth/email-already-in-use'){
        this.toastr.error('Este correo esta ya en uso.', 'Registro')
        this.alerta2Color(['red', 'black'], ['email', 'pass']);
        this.turnBlackInTime(['email'], 5000)
      }
      else
        this.toastr.error('Hubo un error al registrar este usuario', 'Error')
    })
  }

  estiloInput(inputName: string): string{
    let resp = "";

    if(this.usuarioForm.get(inputName)?.invalid && this.usuarioForm.get(inputName)?.touched)
      resp ="red";
    else if(this.usuarioForm.get(inputName)?.valid && this.usuarioForm.get(inputName)?.touched) 
      resp = "green";
    else
      resp = "black";
      
    return resp;
  }

  alerta2Color = (color: string[], name: string[]) => {
    if(color.length == 1)
      for(let i = 0; i < name.length; i++)
        document.getElementById(name[i])?.setAttribute('style', `color: ${color[0]}`)
    else 
      for(let i = 0; i < name.length; i++)
        document.getElementById(name[i])?.setAttribute('style', `color: ${color[i]}`)
  }

  turnBlackInTime = (name: string[], timeOut: number) => {
    setTimeout(() => {
      this.alerta2Color(['black'], name);
     }, timeOut);
  }
}
