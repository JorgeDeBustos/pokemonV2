import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AppComponent } from './app.component';
import { RestPokemonComponent } from './rest-pokemon/rest-pokemon.component';

//Only pokemon path should go to RestPokemonComponent, but in this case we will make any path go to that component
const appRoutes: Routes = [
  { path: '', component: RestPokemonComponent },
  { path: 'pokemon', component: RestPokemonComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],

  exports: [RouterModule],
})
export class AppRoutingModule {}
