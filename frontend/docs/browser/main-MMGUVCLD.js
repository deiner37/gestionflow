import{K as h,e as n,h as p,ja as l,k as m,ka as H,la as C,ma as g,n as f,na as E,oa as R,pa as A,ra as b,sa as I,ua as a,z as v}from"./chunk-WLZOE7EK.js";var s=class t{title="user-product-invoice-frontend";static \u0275fac=function(e){return new(e||t)};static \u0275cmp=v({type:t,selectors:[["app-root"]],decls:1,vars:0,template:function(e,o){e&1&&h(0,"router-outlet")},dependencies:[R],encapsulation:2})};var w=()=>new a().isAuthenticated(),y=[{path:"",loadChildren:()=>import("./chunk-34H4UHLM.js").then(t=>t.AuthModule)},{path:"home",canActivate:[w],canActivateChild:[w],loadChildren:()=>import("./chunk-N7LYBK7Y.js").then(t=>t.HomeModule)}];var c=class t{constructor(r,e){this.authService=r;this.router=e}intercept(r,e){let o=this.authService.getToken(),i=r;return o&&(i=r.clone({setHeaders:{Authorization:`Bearer ${o}`}})),e.handle(i).pipe(p(d=>d.toString().includes("401")?(console.log("Token inv\xE1lido o expirado, cerrando sesi\xF3n..."),this.authService.logout(),this.router.navigate(["/login"]),n(()=>new Error("Sesi\xF3n expirada. Por favor, inicia sesi\xF3n nuevamente."))):n(()=>d)))}static \u0275fac=function(e){return new(e||t)(f(a),f(A))};static \u0275prov=m({token:t,factory:t.\u0275fac})};var u=class t{intercept(r,e){return e.handle(r).pipe(p(o=>{let i="Ocurri\xF3 un error inesperado.";return o.error instanceof ErrorEvent?i=`Error: ${o.error.message}`:i=`Error ${o.status}: ${o.error.message||o.statusText}`,console.error(i),n(()=>new Error(i))}))}static \u0275fac=function(e){return new(e||t)};static \u0275prov=m({token:t,factory:t.\u0275fac})};var x={providers:[b(y,I()),E(),H(C()),{provide:l,useClass:c,multi:!0},{provide:l,useClass:u,multi:!0}]};g(s,x).catch(t=>console.error(t));
