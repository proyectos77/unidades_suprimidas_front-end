import { HttpInterceptorFn } from '@angular/common/http';

export const httpInterceptor: HttpInterceptorFn = (req, next) => {
    const token = sessionStorage.getItem('token');
    console.log(token);

    if (token && ['POST', 'PUT', 'PATCH', 'GET'].includes(req.method)) {


        const head = req.clone({
            setHeaders: { Authorization: `Bearer ${token}` }
        });
        return next(head);
    }

    return next(req);

};
