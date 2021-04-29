import {Component, OnDestroy, OnInit} from '@angular/core';
import {take, takeUntil} from "rxjs/operators";
import {RecipeGetDto} from "../shared/dtos/recipe.get.dto";
import {RecipeService} from "../shared/recipe.service";
import {Location} from "@angular/common";
import {ActivatedRoute, Router} from "@angular/router";
import {Recipe} from "../../shared/models/recipe";
import {Subject} from "rxjs";
import {FormControl, Validators} from "@angular/forms";
import {AuthenticationService} from "../../shared/services/authentication.service";
import {Rating} from "../../shared/models/rating";
import {faHeart} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.scss']
})

export class RecipeDetailsComponent implements OnInit, OnDestroy {

  recipe: Recipe = null;

  amountControl: FormControl = new FormControl(1, [Validators.min(0), Validators.max(99)])

  amount: number = 1;

  loading: boolean = true;
  found: boolean = true;

  max = 5;
  rate = 0;
  isReadonly = false;
  overStar: number | undefined;

  userID: number | undefined;

  unsubscriber$ = new Subject();

  likeIcon = faHeart;

  constructor(private recipeService: RecipeService, private authService: AuthenticationService,
              private location: Location, private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.userID = this.authService.getID();
    this.getRecipe();

    this.recipeService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$))
      .subscribe((recipe) => {
      if (this.found && this.recipe.ID == recipe.ID) {
        this.recipe.averageRating = recipe.averageRating;
      }});

    this.recipeService.listenForRateChange().pipe(takeUntil(this.unsubscriber$))
      .subscribe((rating) => {
        if(this.userID != null && this.userID == rating.userID){
          this.rate = rating.rating; this.recipe.personalRating = rating.rating;
        }});
  }

  getRecipe(): void{
    const ID = this.route.snapshot.paramMap.get('id');
    const recipeDTO: RecipeGetDto = {recipeID: +ID, userIDRating: this.userID};

    this.recipeService.getRecipeByID(recipeDTO).subscribe(
      (recipe) => {this.recipe = recipe; this.loading = false; this.rate = recipe.personalRating;},
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
    this.overStar = 0;
  }

  giveRating(ratingValue: number): void {
    const rating: Rating = {rating: ratingValue, recipeID: this.recipe.ID, userID: this.userID}
    this.recipeService.giveRating(rating).subscribe(() => {});
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
