import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, Firestore, orderBy, where, query, doc, updateDoc, getDoc, deleteDoc } from '@angular/fire/firestore';
import { Storage, ref, deleteObject, uploadBytesResumable, percentage, getDownloadURL, UploadTaskSnapshot, getBlob } from '@angular/fire/storage';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

export interface Archivo {
  id?: string;
  usuario: string;
  nombre: string;
  url: string;
  tipo: string;
  size: number;
  type: string;
  language?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ArchivoService {
  uploadPercent!: Observable<{ progress: number; snapshot: UploadTaskSnapshot; }>;

  constructor(private storage: Storage, private fire: Firestore, private sanitizer: DomSanitizer) { }

  async uploadFile(file: any, usuario: any): Promise<any> {

    const path = `${usuario}/${file.name}`;
    let data = {
      uploaded: false,
      url: ""
    };
  
    if(file){
      try {
        const storageRef = ref(this.storage, path);
        const task = uploadBytesResumable(storageRef, file);
        this.uploadPercent = percentage(task);
        await task;
        data.uploaded = true;
        data.url = await getDownloadURL(storageRef);
      } catch(e: any) {
        console.error(e);
      }   
    } 

    return data;
  }
  
  async deleteFile(filePath: string): Promise<boolean>{
    let deleted: boolean = false;
    try {
      const storageRef = ref(this.storage, filePath);
      await deleteObject(storageRef);
      deleted = true;
    } catch(e: any) {
      console.error(e);
    }
    
    return deleted;
  }

  async getFile(filePath: string): Promise<Blob>{
    let file: any;
    
    try {
      const storageRef = ref(this.storage, filePath);
      file = await getBlob(storageRef);
    } catch(e: any) {
      console.error(e);
    }
    
    return file;
  }

  async agregarArchivo(archivo: Archivo){
    let task = collection(this.fire, 'archivo');

    await addDoc(task, archivo);
  }

  obtenerArchivos(uid: string): Observable<Archivo[]>{
    return collectionData<Archivo>(
      query<Archivo>(
        collection(this.fire, 'archivo') as CollectionReference<Archivo>, where('usuario', '==', uid), orderBy("nombre")
      ), {idField: 'id'}
    );
  }

  async actualizarArchivo(datos: any, id: string){
    let task = doc(this.fire, 'archivo', id);

    await updateDoc(task, datos);
  }

  async obtenerArchivo(id: string){
    let task = doc(this.fire, 'archivo', id);

    let docSnap = await getDoc(task);

    if (docSnap.exists()) {
      return docSnap.data();
    } else {
      return false;
    }
  }

  async eliminarArchivo(id: string){
    let task = doc(this.fire, 'archivo', id);

    await deleteDoc(task);
  }

  formatBytes(bytes: any, decimals?: any) {
    if (bytes === 0) {
      return '0 Bytes';
    }
    const k = 1024;
    const dm = decimals <= 0 ? 0 : decimals || 2;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  }

  sanitizerUrl(url: string): SafeUrl{
    return this.sanitizer.bypassSecurityTrustResourceUrl(url)
  }
}
