import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ErrorComponent } from '../components/error/error.component';
import { CreateRaArchComponent } from '../components/create-ra-arch/create-ra-arch.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'create-RA', component: CreateRaArchComponent },
  { path: 'create-ra', component: CreateRaArchComponent },
  {
    path: '**',
    component: ErrorComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
