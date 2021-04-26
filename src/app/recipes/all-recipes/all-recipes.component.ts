import { Component, OnInit } from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged} from 'rxjs/operators';
import {RecipeService} from '../shared/recipe.service';
import {Recipe} from '../../shared/models/recipe';
import {ActivatedRoute} from '@angular/router';
import {Category} from '../../shared/models/category';

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss']
})
export class AllRecipesComponent implements OnInit {

  recipes: Recipe[];
  categories: Category[];
  loading: boolean = true;

  totalItems: number;
  currentPage: number = 1;
  itemsPrPage: number = 12;
  smallNumPages: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  recipeCategory: number = 0;
  sortingType: string = 'ADDED';
  sorting: string = 'asc';

  constructor(private recipeService: RecipeService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.searchTerms.pipe(
      debounceTime(300),
      distinctUntilChanged(),
    ).subscribe((search) => {this.searchTerm = search; this.getRecipes()});

    this.getCategories();
    this.getRecipes();
  }

  getRecipes(): void {
    const filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
                   + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}`;
    this.loading = true;

    this.recipeService.getRecipes(filter).subscribe((FilterList) => {
      this.totalItems = FilterList.totalItems;
      this.recipes = FilterList.list;
    }, error => {this.loading = false}, () => {this.loading = false; });
  }

  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories;}, (error) => {}, () => {})
  }

  pageChanged($event: any): void {
    if ($event.page !== this.currentPage){
      this.currentPage = $event.page;
      this.getRecipes();
    }
  }

  itemsPrPageUpdate(): void{
    this.smallNumPages = Math.ceil(this.totalItems / this.itemsPrPage);
    this.currentPage = 1;
    this.getRecipes();
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

}
