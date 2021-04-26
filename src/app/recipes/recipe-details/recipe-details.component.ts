import {Component, OnDestroy, OnInit} from '@angular/core';
import {take, takeUntil} from "rxjs/operators";
import {RecipeGetDto} from "../shared/dtos/recipe.get.dto";
import {RecipeService} from "../shared/recipe.service";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Recipe} from "../../shared/models/recipe";
import {Subject} from "rxjs";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})

export class RecipeDetailsComponent implements OnInit {

  recipe: Recipe = null;

  loading: boolean = true;
  found: boolean = true;

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
}
