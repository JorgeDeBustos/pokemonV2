import { Component, OnInit } from '@angular/core';
import { PokemonService } from '../services/pokemon.service';

@Component({
  selector: 'app-rest-pokemon',
  templateUrl: './rest-pokemon.component.html',
  styleUrls: ['./rest-pokemon.component.css'],
})
export class RestPokemonComponent implements OnInit {
  public offset: number = 0;
  public limit: number = 20;
  public maxLimitPokemon: number;
  public nextApiUrl: string = null;
  public previousApiUrl: string = null;
  public filter: string = '';
  public optionSelected: string = '20';
  public pokemonArray: any[] = [];
  public pokemonArrayToShow: any[] = [];
  public pokemonArrayLoaded: boolean = false;

  constructor(private pokemonService: PokemonService) {}
  ngOnInit() {
    this.getPokemonForms();
  }

  getPokemonForms() {
    this.pokemonArrayLoaded = false;
    this.pokemonService
      .getPokemonForms(this.offset, this.limit)
      .subscribe((data) => {
        console.log('Pokemon ', data);
        this.parsePokemonListToArray(data);
      });
  }

  parsePokemonListToArray(pokemonForms) {
    this.maxLimitPokemon = pokemonForms.count;
    this.nextApiUrl = pokemonForms.next;
    this.previousApiUrl = pokemonForms.previous;
    pokemonForms.results.forEach((pokemonForm: any) => {
      this.pokemonArrayToShow = [];
      this.pokemonArray = [];
      this.pokemonService.getPokemon(pokemonForm.url).subscribe((data) => {
        data['name'] = data['name'].replace(/-/g, ' ');
        this.pokemonArray.push(data);
        if (this.pokemonArray.length == pokemonForms.results.length) {
          this.pokemonArrayToShow = this.pokemonArray;
          this.searchPokemon();
        }
      });
    });
  }

  transformMetric(metric: number) {
    return metric / 10;
  }

  searchPokemon() {
    if (this.filter == '') {
      this.pokemonArrayToShow = this.pokemonArray;
    } else {
      this.pokemonArrayToShow = [];
      this.pokemonArray.forEach((pokemon) => {
        if (pokemon.name.toLowerCase().includes(this.filter.toLowerCase())) {
          this.pokemonArrayToShow.push(pokemon);
        }
      });
    }
    this.pokemonArrayLoaded = true;
  }

  changePokemonNumber() {
    if (Number(this.optionSelected)) {
      this.limit = Number(this.optionSelected);
    } else {
      this.limit = this.maxLimitPokemon;
    }
    this.offset = 0;
    this.getPokemonForms();
  }

  changePage(type) {
    if (type == 'next') {
      this.offset = this.offset + this.limit;
    } else {
      this.offset = this.offset - this.limit;
    }
    this.getPokemonForms();
  }

  transformString(name) {
    return name.replace(/-/g, ' ');
  }
}
