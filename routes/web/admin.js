const Router = require('@koa/router');
const paginate = require('koa-ctx-paginate');

const policies = require('#helpers/policies');
const web = require('#controllers/web');

const router = new Router({ prefix: '/admin' });

router
  .use(policies.ensureAdmin)
  .use(policies.ensureOtp)
  .use(web.breadcrumbs)
  // don't cache anything
  // <https://github.com/koa-modules/koa-no-cache/issues/5>
  .use((ctx, next) => {
    ctx.set('Surrogate-Control', 'no-store');
    ctx.set(
      'Cache-Control',
      'no-store, no-cache, must-revalidate, proxy-revalidate'
    );
    ctx.set('Pragma', 'no-cache');
    ctx.set('Expires', '0');
    return next();
  })
  .get('/', web.admin.dashboard)

  // users
  .get('/users', paginate.middleware(10, 50), web.admin.users.list)
  .get('/users/:id', web.admin.users.retrieve)
  .put('/users/:id', web.admin.users.update)
  .post('/users/:id/login', web.admin.users.login)
  .delete('/users/:id', web.admin.users.remove)

  // domains
  .get('/domains', paginate.middleware(10, 50), web.admin.domains.list)
  .put('/domains/:id', web.admin.domains.update)
  .delete('/domains/:id', web.admin.domains.remove);

module.exports = router;
