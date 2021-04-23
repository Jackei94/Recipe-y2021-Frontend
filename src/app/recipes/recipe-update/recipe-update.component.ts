import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Recipe} from "../../shared/models/recipe";
import {IngredientEntry} from "../../shared/models/ingredient-entry";
import {Category} from "../../shared/models/category";
import {RecipeService} from "../shared/recipe.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-recipe-update',
  templateUrl: './recipe-update.component.html',
  styleUrls: ['./recipe-update.component.scss']
})
export class RecipeUpdateComponent implements OnInit {

  recipeForm = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(5), Validators.maxLength(32)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
    preparations: new FormControl('', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]),
    imageURL: new FormControl(''),
    category: new FormControl('', [Validators.required]),
    ingredients: new FormControl([], [Validators.required, Validators.minLength(1)])
  });

  ingredientForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(32)]),
    amount: new FormControl('', [Validators.required, Validators.min(0), Validators.max(10000)]),
    measurementUnit: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
  });

  recipe: Recipe = null;
  ingredients: IngredientEntry[] = [];
  categories: Category[] = [];

  selectedImage: File = null;

  imageURL: string = '';
  invalidImageURL: string = 'https://firebasestorage.googleapis.com/v0/b/eb-sdm3.appspot.com/o/NoImage.png?alt=media&token=9f213b80-6356-4f8e-83b6-301936912a6e';
  loading: boolean = true;
  updateLoad: boolean = false;
  error: string = '';
  changed: boolean = false;
  found: boolean = true;


  constructor(private recipeService: RecipeService, private location: Location,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories;}, (error) => {this.error = error.error.message; this.loading = false;})
  }

  getRecipe(): void{
    const id = +this.route.snapshot.paramMap.get('id');
    this.recipeService.getRecipeByID(id).subscribe(
      (recipe) => {this.recipe = recipe; this.initializeText();},
      (error) => {this.found = false;}
    )
  }

  initializeText(){

  }

}
