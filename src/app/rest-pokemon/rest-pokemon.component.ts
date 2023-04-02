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

  /**
   * Call to https://pokeapi.co/api/v2/ with offset and limit dynamic values to obtain the urls with the information of each pokemon
   */
  getPokemonForms() {
    this.pokemonArrayLoaded = false;
    this.pokemonService
      .getPokemonForms(this.offset, this.limit)
      .subscribe((data) => {
        this.parsePokemonListToArray(data);
      });
  }

  /**
   * Call to the url of each pokemon to obtain its information and store it in the pokemonArray array
   */
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

  /**
   * Transform hectograms to kilograms and decimetres to meters
   */
  transformMetric(metric: number) {
    return metric / 10;
  }

  /**
   * Search if the name entered in the filter matches any pokemon name, if so it is added to the pokemonArrayToShow array, if the filter is empty the pokemonArrayToShow array is equal to that of all pokemon (pokemonArray).
   */
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

  /**
   * Change the value of the limit variable when selecting how many pokemon you want to see on the same page
   */
  changePokemonNumber() {
    if (Number(this.optionSelected)) {
      this.limit = Number(this.optionSelected);
    } else {
      this.limit = this.maxLimitPokemon;
    }
    this.offset = 0;
    this.getPokemonForms();
  }

  /**
   * Changes the value of the offset variable when the Previous or Next header button is selected
   */
  changePage(type) {
    if (type == 'next') {
      this.offset = this.offset + this.limit;
    } else {
      this.offset = this.offset - this.limit;
    }
    this.getPokemonForms();
  }

  /**
   * Replace hyphens in stat names
   */
  transformStatString(name) {
    return name.replace(/-/g, ' ');
  }
}
