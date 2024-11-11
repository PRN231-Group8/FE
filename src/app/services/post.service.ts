import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { BaseResponse } from '../interfaces/models/base-response';
import { Post } from '../interfaces/models/post';
import { CommentRequest } from '../interfaces/models/request/comment-request';
import { CommentResponse } from '../interfaces/models/response/comment-response';
import { UpdatePostRequest } from '../interfaces/models/request/update-post-request';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private apiUrl = `${environment.BACKEND_API_URL}/api/posts`;

  constructor(private http: HttpClient) {}

  getAllPosts(
    status?: string,
    searchTerm?: string,
    page = 1,
    pageSize = 10,
  ): Observable<BaseResponse<Post[]>> {
    const params = new HttpParams()
      .set('filter-status', status || '')
      .set('search-term', searchTerm || '')
      .set('page-number', page.toString())
      .set('page-size', pageSize.toString());

    return this.http.get<BaseResponse<Post[]>>(this.apiUrl, {
      params,
      responseType: 'json',
    });
  }

  getUserPosts(
    status?: string,
    searchTerm?: string,
    page = 1,
    pageSize = 10,
  ): Observable<BaseResponse<Post[]>> {
    const params = new HttpParams()
      .set('filter-status', status || '')
      .set('search-term', searchTerm || '')
      .set('page-number', page.toString())
      .set('page-size', pageSize.toString());

    return this.http.get<BaseResponse<Post[]>>(`${this.apiUrl}/history`, {
      params,
      responseType: 'json',
    });
  }

  getPendingPosts(
    searchTerm?: string,
    page = 1,
    pageSize = 10,
  ): Observable<BaseResponse<Post[]>> {
    const params = new HttpParams()
      .set('search-term', searchTerm || '')
      .set('page-number', page.toString())
      .set('page-size', pageSize.toString());

    return this.http.get<BaseResponse<Post[]>>(`${this.apiUrl}/pending`, {
      params,
      responseType: 'json',
    });
  }

  getPostById(postId: string): Observable<BaseResponse<Post>> {
    return this.http.get<BaseResponse<Post>>(`${this.apiUrl}/${postId}`, {
      responseType: 'json',
    });
  }

  createPost(formData: FormData): Observable<BaseResponse<Post>> {
    return this.http.post<BaseResponse<Post>>(this.apiUrl, formData);
  }

  updatePost(
    postId: string,
    postData: UpdatePostRequest,
  ): Observable<BaseResponse<Post>> {
    return this.http.put<BaseResponse<Post>>(
      `${this.apiUrl}/${postId}`,
      postData,
      {
        responseType: 'json',
      },
    );
  }

  deletePost(postId: string): Observable<BaseResponse<boolean>> {
    return this.http.delete<BaseResponse<boolean>>(`${this.apiUrl}/${postId}`, {
      responseType: 'json',
    });
  }
  // Add a comment to a post
  addComment(model: CommentRequest): Observable<BaseResponse<CommentResponse>> {
    return this.http.post<BaseResponse<CommentResponse>>(
      `${environment.BACKEND_API_URL}/api/comments`,
      model,
    );
  }
  getCommentsByPostId(
    postId: string,
  ): Observable<BaseResponse<CommentResponse[]>> {
    return this.http.get<BaseResponse<CommentResponse[]>>(
      `${environment.BACKEND_API_URL}/api/comments/post/${postId}`,
    );
  }
}
