import { inject, Injectable } from '@angular/core';
import { Firestore, collection, addDoc, collectionData, docSnapshots, query, limit, getDocs, startAfter, doc, getDoc } from '@angular/fire/firestore';
import { ref, uploadBytesResumable, getDownloadURL, Storage } from '@angular/fire/storage';
import { from, Observable } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { ProjectPayload } from '../interfaces/project';
import { ApiService } from './api.service';
import { FirebaseDocument } from '../interfaces/firebase-document';

@Injectable({
  providedIn: 'root'
})
export class ProjectService extends ApiService {
  private firestore: Firestore = inject(Firestore);
  private storage = inject(Storage);

  private projectsCollection = collection(this.firestore, 'projects');

  addProject(payload: ProjectPayload): Observable<string> {
    const promise = addDoc(this.projectsCollection, payload).then((response) => response.id);
    return from(promise);
  }

  getProjectWithId(id: string) {
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
        snapshot => {},
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


  getProjects(first: number, rows: number): Observable<{ projects: ProjectPayload[], totalRecords: number }> {
    const totalRecordsPromise = getDocs(this.projectsCollection).then(snapshot => snapshot.size);
  
    // Create a base query with a limit
    let projectQuery = query(this.projectsCollection, limit(rows));
  
    if (first > 0) {
      // Handle pagination: retrieve the last document of the previous page
      return from(getDocs(query(this.projectsCollection, limit(first)))).pipe(
        switchMap(previousPageSnapshot => {
          const lastVisible = previousPageSnapshot.docs[previousPageSnapshot.docs.length - 1];
          projectQuery = query(this.projectsCollection, startAfter(lastVisible), limit(rows));
  
          return from(Promise.all([totalRecordsPromise, getDocs(projectQuery)]));
        }),
        map(([totalRecords, snapshot]) => {
          const projects = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data() as ProjectPayload
          }));
          return { projects, totalRecords };
        })
      );
    }
  
    return from(Promise.all([totalRecordsPromise, getDocs(projectQuery)])).pipe(
      map(([totalRecords, snapshot]) => {
        const projects = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data() as ProjectPayload
        }));
        return { projects, totalRecords };
      })
    );
  }
  

  getProject(): Observable<ProjectPayload[]> {
    return docSnapshots(this.projectsCollection).pipe(
      map((snapshotProj: any) =>
        snapshotProj.docs.map((doc: { id: any; data: () => ProjectPayload; }) => ({
          id: doc.id,  // Add the document ID here
          ...doc.data() as ProjectPayload,
        })) 
      )
    );
  }
}
