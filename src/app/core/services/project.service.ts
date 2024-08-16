import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, docSnapshots, query, limit, getDocs, startAfter, doc, getDoc, where, updateDoc, deleteDoc } from '@angular/fire/firestore';
import { ref, uploadBytesResumable, getDownloadURL, Storage } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { ProjectPayload } from '../interfaces/project';
import { FirebaseDocument } from '../interfaces/firebase-document';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private firestore: Firestore = inject(Firestore);
  private storage: Storage = inject(Storage);

  private projectsCollection = collection(this.firestore, 'projects');

  addProject(payload: ProjectPayload): Observable<string> {
    return from(addDoc(this.projectsCollection, payload)).pipe(
      map(response => response.id)
    );
  }

  getProjectWithId(id: string): Observable<ProjectPayload> {
    const docRef = doc(this.firestore, `projects/${id}`);
    return from(getDoc(docRef)).pipe(
      map(doc => ({ id: doc.id, ...doc.data() as ProjectPayload }))
    );
  }

  uploadImage(file: File): Observable<string> {
    const filePath = `projects/${file.name}_${Date.now()}`;
    const fileRef = ref(this.storage, filePath);
    const uploadTask = uploadBytesResumable(fileRef, file);

    return new Observable<string>(observer => {
      uploadTask.on(
        'state_changed',
        () => {},
        error => observer.error(error),
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(downloadURL => {
            observer.next(downloadURL);
            observer.complete();
          });
        }
      );
    });
  }

  getProjects(first: number, rows: number, filter: string): Observable<{ projects: ProjectPayload[], totalRecords: number }> {
    let projectQuery = query(this.projectsCollection);

    if (filter !== 'all') {
      projectQuery = query(this.projectsCollection, where('type', '==', filter));
    }

    return from(getDocs(projectQuery)).pipe(
      switchMap(snapshot => {
        const totalRecords = snapshot.size;
        let paginatedQuery = query(projectQuery, limit(rows));
    
        if (first > 0) {
          const lastVisible = snapshot.docs[first - 1];
          paginatedQuery = query(projectQuery, startAfter(lastVisible), limit(rows));
        }
    
        return from(getDocs(paginatedQuery)).pipe(
          map(paginatedSnapshot => {
            const projects = paginatedSnapshot.docs.map(doc => ({
              id: doc.id,
              ...doc.data() as ProjectPayload
            }));
            return { projects, totalRecords };
          })
        );
      })
    );
  }

  updateProject(projectId: string, updatedFields: Partial<ProjectPayload>): Observable<void> {
    const docRef = doc(this.firestore, `projects/${projectId}`);
    return from(updateDoc(docRef, updatedFields));
  }
  
  deleteProject(projectId: string): Observable<void> {
    const docRef = doc(this.firestore, `projects/${projectId}`);
    return from(deleteDoc(docRef));
  }
}
