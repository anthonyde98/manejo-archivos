import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-mis-archivos',
  templateUrl: './mis-archivos.component.html',
  styleUrls: ['./mis-archivos.component.css']
})
export class MisArchivosComponent implements OnInit {
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
    sheet: "spreadsheet",
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
    msdown: "xcel",
    compressed: "zipper",
    pdf: "pdf"
  }
  preFiles: any = [];
  toSaveFiles: any = [];
  toReadFiles: any = [];
  droppedFiles: any = [];
  selectedFiles: any = [];
  btnActivo = true;

  constructor() { }

  ngOnInit(): void {
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

  saveFiles(){
    this.droppedFiles.forEach((element: any) => {
      this.toSaveFiles.push(element);
    });

    this.selectedFiles.forEach((element: any) => {
      this.toSaveFiles.push(element);
    });

    if(this.toSaveFiles.length === 0){
      return
    }

    this.btnActivo = false;

    console.log(this.toSaveFiles);
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

  formatBytes(bytes: any, decimals: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  deleteDroppedFile(i: number){
    this.droppedFiles.splice(i, 1);
    this.preFiles.splice(i, 1);
  }

}
