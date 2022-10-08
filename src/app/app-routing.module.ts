import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from '../components/home/home.component';
import { ErrorComponent } from '../components/error/error.component';
import { CreateRaArchComponent } from '../components/create-ra-arch/create-ra-arch.component';
import { CreateSaArchComponent } from 'src/components/create-sa-arch/create-sa-arch.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  { path: 'create-RA', component: CreateRaArchComponent },
  { path: 'create-ra', component: CreateRaArchComponent },
  { path: 'create-sa', component: CreateSaArchComponent },
  { path: 'create-Sa', component: CreateSaArchComponent },
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
