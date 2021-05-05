import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {RecipeService} from '../shared/recipe.service';
import {Recipe} from '../../shared/models/recipe';
import {ActivatedRoute} from '@angular/router';
import {Category} from '../../shared/models/category';
import {AuthenticationService} from "../../shared/services/authentication.service";
import {faHeart, faHeartBroken, faStar} from "@fortawesome/free-solid-svg-icons";
import {FavoriteDto} from "../shared/dtos/favorite.dto";
import {UserService} from "../../shared/services/user.service";

@Component({
  selector: 'app-all-recipes',
  templateUrl: './all-recipes.component.html',
  styleUrls: ['./all-recipes.component.scss']
})
export class AllRecipesComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  categories: Category[];
  loading: boolean = true;

  totalItems: number;
  currentPage: number = 1;
  itemsPrPage: number = 20;
  smallNumPages: number = 0;

  searchTerms = new Subject<string>();
  searchTerm: string = "";

  recipeCategory: number = 0;
  sortingType: string = 'ADDED';
  sorting: string = 'ASC';
  showFavorites: boolean = false;

  userID: number | undefined;

  unsubscriber$ = new Subject();

  starIcon = faStar;
  likeIcon = faHeart;
  dislikeIcon = faHeartBroken;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute,
              private authService: AuthenticationService, private userService: UserService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getRecipes(true)});

    this.userID = this.authService.getID();
    this.userService.joinPersonalRoom(this.userID);
    this.getCategories();
    this.getRecipes(true);

    this.recipeService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((recipe) => {
      const placement = this.recipes.findIndex((r) => r.ID === recipe.ID)
        if(placement !== -1){this.recipes[placement] = recipe;}});

    this.recipeService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {this.getRecipes(false);});

    this.recipeService.listenForDeleteChange().pipe(takeUntil(this.unsubscriber$)).subscribe((recipe) => {
      this.getRecipes(false);});

    this.recipeService.listenForFavoriteUpdate().pipe(takeUntil(this.unsubscriber$)).
    subscribe((favoriteDTO) => {this.getRecipes(false)});

  }

  getRecipes(shouldLoad: boolean): void {

    this.loading = shouldLoad

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
                   + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}`;

    if(this.userID)
    {
      filter += `&userIDFavorite=${this.userID}&showFavorites=${this.showFavorites}`;
      this.recipeService.getPersonalRecipes(filter).subscribe((filterList) => {
        this.totalItems = filterList.totalItems;
        this.recipes = filterList.list;},
        () => {this.loading = false;}, () => {this.loading = false;})
    }

    else
      {
        this.recipeService.getRecipes(filter).subscribe((FilterList) => {
          this.totalItems = FilterList.totalItems;
          this.recipes = FilterList.list;
        }, error => {this.loading = false}, () => {this.loading = false; });
      }
  }

  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories;}, (error) => {}, () => {})
  }

  favoriteRecipe(recipeID: number): void{
    const favoriteDTO: FavoriteDto = {favorite: true, recipeID: recipeID, userID: this.userID}
    this.recipeService.favoriteRecipe(favoriteDTO).subscribe(() => {});
  }

  unfavoriteRecipe(recipeID: number): void{
    const favoriteDTO: FavoriteDto = {favorite: false, recipeID: recipeID, userID: this.userID}
    this.recipeService.unfavoriteRecipe(favoriteDTO).subscribe(() => {});
  }

  pageChanged($event: any): void {
    if ($event.page !== this.currentPage){
      this.currentPage = $event.page;
      this.getRecipes(true);
    }
  }

  itemsPrPageUpdate(): void{
    this.smallNumPages = Math.ceil(this.totalItems / this.itemsPrPage);
    this.currentPage = 1;
    this.getRecipes(true);
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }

  calculateRating(rating: number): number{
    const roundedValue = Math.round(rating);
    return (rating == roundedValue) ? roundedValue : rating;
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }

}
