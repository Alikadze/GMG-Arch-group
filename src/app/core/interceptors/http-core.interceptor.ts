import { HttpInterceptorFn,  } from "@angular/common/http";


export const HttpCoreInterceptor: HttpInterceptorFn = (req, next) => {
  
  req = req.clone({
    setHeaders: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': 'http://localhost:4200',
    }
  })

  return next(req)
};