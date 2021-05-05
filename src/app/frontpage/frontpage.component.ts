import {Component, OnDestroy, OnInit} from '@angular/core';
import {Recipe} from "../shared/models/recipe";
import {RecipeService} from "../recipes/shared/recipe.service";
import {Subject} from "rxjs";
import {takeUntil} from "rxjs/operators";
import {faStar} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-frontpage',
  templateUrl: './frontpage.component.html',
  styleUrls: ['./frontpage.component.scss']
})
export class FrontpageComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  loading: boolean = true;

  unsubscriber$ = new Subject();

  starIcon = faStar;

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.getRecipes();

    this.recipeService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).subscribe((recipe) => {
      this.recipes.splice(0, 0, recipe);
      if(this.recipes.length > 4){
        this.recipes.pop();
      }

    });

    this.recipeService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).subscribe((recipe) => {
      const placement = this.recipes.findIndex((r) => r.ID === recipe.ID)
      if(placement !== -1){this.recipes[placement] = recipe;}
    });

    this.recipeService.listenForDeleteChange().pipe(takeUntil(this.unsubscriber$)).subscribe((recipe) => {
      const placement = this.recipes.findIndex((r) => r.ID === recipe.ID)
      if(placement !== -1){this.getRecipes();}
    });
  }

  getRecipes(){
    const filter = `?currentPage=1&itemsPrPage=4&sortingType=ADDED&sorting=DESC`;

    this.recipeService.getRecipes(filter).subscribe((filterList) => {
      this.recipes = filterList.list; this.loading = false;}, () => {this.loading = false;})
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
