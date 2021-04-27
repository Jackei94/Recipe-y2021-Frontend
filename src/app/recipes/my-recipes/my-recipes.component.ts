import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from '../../shared/models/recipe';
import {Category} from '../../shared/models/category';
import {Subject} from 'rxjs';
import {RecipeService} from '../shared/recipe.service';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AuthenticationService} from '../../shared/services/authentication.service';

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  categories: Category[];
  loading: boolean = true;
  id: number;

  totalItems: number;
  currentPage: number = 1;
  itemsPrPage: number = 20;
  smallNumPages: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  recipeCategory: number = 0;
  sortingType: string = 'ADDED';
  sorting: string = 'asc';

  unsubscriber$ = new Subject();

  constructor(private recipeService: RecipeService, private route: ActivatedRoute, private authService: AuthenticationService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getRecipes()});

    this.id = this.authService.getID();
    this.getCategories();
    this.getRecipes();

    this.recipeService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((recipe) => {
        const placement = this.recipes.findIndex((r) => r.ID === recipe.ID)
        if(placement !== -1){this.recipes[placement] = recipe;}},
      (error) => {});

    this.recipeService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {this.getRecipes();}, (error) => {});

  }

  getRecipes(): void {
    const filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
      + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}&userID=${this.id}`;
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

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
