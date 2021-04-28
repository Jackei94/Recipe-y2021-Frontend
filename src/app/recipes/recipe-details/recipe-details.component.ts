import {Component, OnDestroy, OnInit} from '@angular/core';
import {take, takeUntil} from "rxjs/operators";
import {RecipeGetDto} from "../shared/dtos/recipe.get.dto";
import {RecipeService} from "../shared/recipe.service";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Recipe} from "../../shared/models/recipe";
import {Subject} from "rxjs";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})

export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe = null;

  amountControl: FormControl = new FormControl(1, [Validators.min(0), Validators.max(99)])

  amount: number = 1;

  loading: boolean = true;
  found: boolean = true;

  max = 5;
  rate = 0;
  isReadonly = false;
  overStar: number | undefined;

  constructor(private recipeService: RecipeService, private location: Location,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getRecipe();
  }

  getRecipe(): void{
    const ID = this.route.snapshot.paramMap.get('id');
    const recipeDTO: RecipeGetDto = {recipeID: +ID};

    this.recipeService.getRecipeByID(recipeDTO).subscribe(
      (recipe) => {this.recipe = recipe; this.loading = false;},
      () => {this.loading = false; this.found = false;});
  }

  inCount() {
    if(this.amount+1 <= 99){this.amount += 1;}
  }

  unCount() {
    if(this.amount-1 >=0){this.amount -=1;}
  }

  hoveringOver(value: number): void {
    this.overStar = value;
  }

  resetStar(): void {
    this.overStar = void 0;
  }
}
