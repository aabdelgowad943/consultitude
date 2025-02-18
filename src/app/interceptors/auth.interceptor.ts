import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  let token: string | null = null;

  // Check if localStorage is available
  if (typeof localStorage !== 'undefined') {
    token = localStorage.getItem('token');
  }

  if (token) {
    const modifiedRequest = req.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
    // console.log('token is', token);
    return next(modifiedRequest);
  } else {
    return next(req);
  }
};
