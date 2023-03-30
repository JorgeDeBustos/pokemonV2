import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class PokemonService {
  private urlBase = 'https://pokeapi.co/api/v2/';

  constructor(private http: HttpClient) {}

  getPokemonForms(offset, limit) {
    return this.http.get(
      this.urlBase + 'pokemon?offset=' + offset + '&limit=' + limit
    );
  }

  getPokemon(url){
    return this.http.get(url);
  }

}
