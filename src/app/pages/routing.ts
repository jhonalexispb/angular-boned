import { Routes } from '@angular/router';

const Routing: Routes = [
  {
    path: 'dashboard',
    loadChildren: () => import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'builder',
    loadChildren: () => import('./builder/builder.module').then((m) => m.BuilderModule),
  },
  {
    path: 'crafted/pages/profile',
    loadChildren: () => import('../modules/profile/profile.module').then((m) => m.ProfileModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'crafted/account',
    loadChildren: () => import('../modules/account/account.module').then((m) => m.AccountModule),
    // data: { layout: 'dark-header' },
  },
  {
    path: 'crafted/pages/wizards',
    loadChildren: () => import('../modules/wizards/wizards.module').then((m) => m.WizardsModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'crafted/widgets',
    loadChildren: () => import('../modules/widgets-examples/widgets-examples.module').then((m) => m.WidgetsExamplesModule),
    // data: { layout: 'light-header' },
  },
  {
    path: 'apps/chat',
    loadChildren: () => import('../modules/apps/chat/chat.module').then((m) => m.ChatModule),
    // data: { layout: 'light-sidebar' },
  },
  {
    path: 'apps/users',
    loadChildren: () => import('./user/user.module').then((m) => m.UserModule),
  },
  {
    path: 'apps/roles',
    loadChildren: () => import('./role/role.module').then((m) => m.RoleModule),
  },
  {
    path: 'apps/permissions',
    loadChildren: () => import('./permission/permission.module').then((m) => m.PermissionModule),
  },

  //Mis modulos
  {
    path: 'roles',
    loadChildren: () => import('../modules/roles/roles.module').then((m) => m.RolesModule),
  },

  {
    path: 'usuarios',
    loadChildren: () => import('../modules/users/users.module').then((m) => m.UsersModule),
  },

  {
    path: 'configuraciones',
    loadChildren: () => import('../modules/configuration/configuration.module').then((m) => m.ConfigurationModule),
  },

  {
    path: 'productos',
    loadChildren: () => import('../modules/products/products.module').then((m) => m.ProductsModule),
  },

  {
    path: 'clientes',
    loadChildren: () => import('../modules/clientes/clientes.module').then((m) => m.ClientesModule),
  },

  {
    path: 'compras',
    loadChildren: () => import('../modules/compras/compras.module').then((m) => m.ComprasModule),
  },

  {
    path: 'guias_prestamo',
    loadChildren: () => import('../modules/guias-prestamo/guias-prestamo.module').then((m) => m.GuiasPrestamoModule),
  },

  {
    path: 'transporte_orden_venta',
    loadChildren: () => import('../modules/transporte-orden-venta/transporte-orden-venta.module').then((m) => m.TransporteOrdenVentaModule),
  },

  {
    path: 'movimientos',
    loadChildren: () => import('../modules/movimientos/movimientos.module').then((m) => m.MovimientosModule),
  },




  {
    path: 'ventas',
    loadChildren: () => import('../modules/ventas/ventas.module').then((m) => m.VentasModule),
  },

  {
    path: 'zonas_ventas',
    loadChildren: () => import('../modules/zona-venta/zona-venta.module').then((m) => m.ZonaVentaModule),
  },

  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: 'error/404',
  },
];

export { Routing };
