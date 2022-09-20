import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Archivo, ArchivoService } from 'src/app/services/archivo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { take } from 'rxjs';
import * as Prism from 'prismjs';

@Component({
  selector: 'app-mis-archivos',
  templateUrl: './mis-archivos.component.html',
  styleUrls: ['./mis-archivos.component.css']
})
export class MisArchivosComponent implements OnInit {
  @ViewChild('codeEle') codeEle!: ElementRef;
  hardTypes = {
    cs: "code",
    php: "code",
    rar: "zipper",
    java: "code",
    ts: "code",
    txt: "lines",
    py: "code"
  }
  normalTypes = {
    sheet: "excel",
    word: "word",
    presentation: "powerpoint",
    audio: "music",
    video: "video",
    csv: "csv",
    css: "code",
    image: "image",
    html: "code",
    json: "invoice",
    javascript: "code",
    msdown: "xmark",
    compressed: "zipper",
    pdf: "pdf",
    xml: "code"
  }
  languages = {
    ts: "typescript",
    js: "javascript",
    css: "css",
    html: "html",
    php: "php",
    xml: "xml",
    cs: "csharp",
    json: "javascript",
    java: "java",
    javac: "java",
    py: "python"
  }
  preFiles: any = [];
  toSaveFiles: any = [];
  toReadFiles: any = [];
  droppedFiles: any = [];
  selectedFiles: any = [];
  checkedFiles: any = [];
  btnActivo = true;
  showFile = {
    doI: false,
    file: {
      nombre: "", url: "", type: "", usuario: ""
    } 
  }
  uploading: any = {
    isIt: false,
    number: 0,
    manny: 0,
    progress: "0%",
    currentFile: ""
  }

  usuario: any;

  constructor(private toastr: ToastrService, private archivoService: ArchivoService, private usuarioService: UsuarioService) { 
    this.usuario = {
      uid: "",
      email: ""
    }

    this.usuarioService.obtenerUsuarioActual().subscribe(data => {
      this.usuario = data;
      this.obtenerArchivos();
    })
  }

  ngOnInit(): void { 
  }

  obtenerArchivos(){
    this.archivoService.obtenerArchivos(this.usuario.uid).subscribe((archivos: Archivo[]) => {
      this.toReadFiles = archivos;
    })
  }

  checkFileList($event: any, archivo: Archivo){
    if($event.target.checked){
      this.checkedFiles.push(archivo);
    }
    else{
      const index = this.checkedFiles.findIndex((file: Archivo) => file === archivo);
      this.checkedFiles.splice(index, 1)
    }
  }

  onFileDropped($event: any) {
    for(let i = 0; i < $event.length; i++){
      this.droppedFiles.push($event[i])
      this.preFiles.push({name: $event[i].name, type: this.setImageType($event[i])})
    }
  }

  fileBrowser($event: any){
    this.selectedFiles = [];
    for(let i = 0; i < $event.files.length; i++){
      this.selectedFiles.push($event.files[i]);
    }
  }

  async saveFiles(){
    this.droppedFiles.forEach((element: any) => {
      this.toSaveFiles.push(element);
    });

    this.selectedFiles.forEach((element: any) => {
      this.toSaveFiles.push(element);
    });

    if(this.toSaveFiles.length === 0){
      this.toastr.warning("No ha colocado ningun archivo para subir.", "Archivos");
      return;
    }

    this.btnActivo = false;
    for(let i = 0; i < this.toSaveFiles.length; i++){
      await this.uploadingFile(this.toSaveFiles[i], i + 1, this.toSaveFiles.length, this.toSaveFiles[i].name)
    }

    this.toSaveFiles = [];
    this.droppedFiles = [];
    this.selectedFiles = [];
    this.preFiles = [];
    this.uploading = {
      isIt: false,
      number: 0,
      manny: 0,
      progress: "0%",
      currentFile: ""
    };
    this.btnActivo = true;
  }

  async uploadingFile(file: any, i: number, count: number, fileName: string){
    setTimeout(() => {
      this.archivoService.uploadPercent.subscribe((progress: any) => {
        this.uploading.isIt = true;
        this.uploading.number = i;
        this.uploading.manny = count;
        this.uploading.progress = progress.progress.toFixed(0) + "%";
        this.uploading.currentFile = fileName;
      })
    }, 0);
    const data = await this.archivoService.uploadFile(file, this.usuario.uid);

    let archivo: Archivo = {
      nombre: file.name,
      usuario: this.usuario.uid,
      url: data.url,
      tipo: file.name.split('.').pop(),
      size: file.size,
      type: file.type
    }

    if(data.uploaded){
      this.archivoService.agregarArchivo(archivo).then(() => { 
        this.toastr.success("Archivo subido correctamente.", "Archivos", {
          timeOut: 2000
        })
      })
    }
  }

  setImageType(file: any){
    const type = file.type;
    const name = file.name;

    for(let format in this.normalTypes){
      if(type.includes(format)){
        return "file-" + this.normalTypes[format as keyof typeof this.normalTypes]
      }
    }
    for(let format in this.hardTypes){
      if(name.split(".").pop().includes(format)){
        return "file-" + this.hardTypes[format as keyof typeof this.hardTypes]
      }
    }

    if(type.includes("text/plain")){
      return "file-lines"
    }

    return "file";
  }

  deleteDroppedFile(i: number){
    this.droppedFiles.splice(i, 1);
    this.preFiles.splice(i, 1);
  }

  formatearSize(size: number): string {
    return this.archivoService.formatBytes(size);
  }

  deleteFileFromList(archivo: Archivo){
    this.toastr.info("Si estas seguro de querer eliminar este archivo, dar click a este mensaje.", "Archivo")
        .onTap
        .pipe(take(1))
        .subscribe(() => {
          this.archivoService.deleteFile(this.usuario.uid + "/" + archivo.nombre).then(data => {
            if(data){
              this.archivoService.eliminarArchivo(archivo.id || "").then(() => {
                this.toastr.error("Archivo eliminado.", "Archivo");

                if(this.checkedFiles.includes(archivo)){
                  const index = this.checkedFiles.findIndex((file: Archivo) => file === archivo);
                  this.checkedFiles.splice(index, 1)
                }
              });
            }
          })
        });
  }

  deleteFilesFromList(){
    this.toastr.info("Si estas seguro de querer eliminar estos archivos, dar click a este mensaje.", "Archivo")
        .onTap
        .pipe(take(1))
        .subscribe(async () => {
          for(let i = 0; i < this.checkedFiles.length; i++){
            let data = await this.archivoService.deleteFile(this.usuario.uid + "/" + this.checkedFiles[i].nombre)
            if(data){
              await this.archivoService.eliminarArchivo(this.checkedFiles[i].id)
            }
          }
          this.toastr.error("Archivos eliminados.", "Archivo");
          this.checkedFiles = [];
        });
  }

  async openShowFile(archivo: Archivo){
    this.showFile.doI = true;
    this.showFile.file = archivo;

    const isCode = (formato: string) => {
      for(let language in this.languages){
        if(formato.includes(language)){
          return true
        }
      }

      return false
    }

    if(!this.showFile.file.type.includes('video') && !this.showFile.file.type.includes('image') && !this.showFile.file.type.includes('audio')){
      if(isCode(this.showFile.file.nombre.split(".").pop() || "")){
        await this.setCodeFile();
      }
      else{
        this.showFile.file.type = "doc";
      }
    }
  }

  quitFile(){
    this.showFile = {
      doI: false,
      file: {
        nombre: "", url: "", type: "", usuario: ""
      } 
    }
  }

  async setCodeFile(){
    const file = await this.archivoService.getFile(this.showFile.file.usuario + "/" + this.showFile.file.nombre)

    let fileReader = new FileReader(); 
    fileReader.onload = (e) => { 
      this.showFile.file.url = fileReader.result?.toString().slice() || ""; 
      this.showFile.file.type = "code";
      setTimeout(() => {
        const code = (this.showFile.file.url || this.codeEle.nativeElement.innerText)
        const grammar = Prism.languages[this.codeFileLanguage()];
        const html = Prism.highlight(code, grammar, this.codeFileLanguage());
        this.codeEle.nativeElement.innerHTML = html
      }, 200);
    } 
    fileReader.readAsText(file);
  }

  codeFileLanguage(){
    return this.languages[this.showFile.file.nombre.split(".").pop() as keyof typeof this.languages]
  }
}
