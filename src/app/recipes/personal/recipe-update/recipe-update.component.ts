import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {Recipe} from "../../../shared/models/recipe";
import {IngredientEntry} from "../../../shared/models/ingredient-entry";
import {Category} from "../../../shared/models/category";
import {RecipeService} from "../../shared/recipe.service";
import {ActivatedRoute, Router} from "@angular/router";
import {Select} from "@ngxs/store";
import {LoginState} from "../../../login/shared/state/login.state";
import {Observable} from "rxjs";
import {User} from "../../../shared/models/user";
import {Location} from "@angular/common";
import {RecipeGetDto} from "../../shared/dtos/recipe.get.dto";
import {take} from "rxjs/operators";

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

  @Select(LoginState.user)
  loggedUser$: Observable<User>;

  constructor(private recipeService: RecipeService, private location: Location,
              private router: Router, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories; this.getRecipe();}, (error) => {this.error = error.error.message; this.loading = false;})
  }

  getRecipe(): void{
    const id = +this.route.snapshot.paramMap.get('id');

    this.loggedUser$.pipe(take(1)).subscribe((user) => {
      const recipeGetDTO: RecipeGetDto = {recipeID: id, userID: user.ID}
      this.recipeService.getPersonalRecipeByID(recipeGetDTO).subscribe(
        (recipe) => {this.recipe = recipe; this.initializeText();},
        (error) => {this.found = false; this.loading = false; this.error = error.error.message;})
    });
  }

  initializeText(){
    if(this.recipe != null){

      this.recipeForm.patchValue({
        title: this.recipe.title,
        description: this.recipe.description,
        preparations: this.recipe.preparations,
        category: this.recipe.category.ID,
        ingredients: this.recipe.ingredientEntries
      })

      this.ingredients = this.recipe.ingredientEntries;
      this.imageURL = this.recipe.imageURL;
      this.loading = false;
    }
  }

  onFileChange(event){
    if(event.target.files.length === 0) {this.selectedImage = null;}
    else{this.selectedImage = <File>event.target.files[0];}
    this.changed = true;
  }

  deleteImage(){

    if(!this.recipe.imageURL.includes('NoImage.png')){
      let imageTitle: string = this.recipe.imageURL.substring(
        this.recipe.imageURL.lastIndexOf("/o/") + 3,
        this.recipe.imageURL.lastIndexOf("?alt"));

      let imageToDelete = {image: imageTitle}

      this.recipeService.deleteImage(imageToDelete).subscribe((response) => {},
        (error) => {this.error = error.error.message;});
    }
  }


  updateRecipe(): void{

    this.updateLoad = true;
    const recipeData = this.recipeForm.value;

    this.loggedUser$.pipe(take(1)).subscribe((user) => {
      this.recipe.title = recipeData.title;
      this.recipe.description = recipeData.description;
      this.recipe.preparations = recipeData.preparations;
      this.recipe.ingredientEntries = recipeData.ingredients;
      this.recipe.category = {ID: recipeData.category, title: ''}

      if(this.changed){
        this.deleteImage();

        if(this.selectedImage){
          this.recipeService.uploadImage(this.selectedImage).subscribe((response) => {
            let urls: string[] = response.message;
            this.imageURL = urls[0];},
            (error) => {this.error = error.error.message},
            () => {
            this.recipe.imageURL = this.imageURL;
            this.sendUpdateRequest();
            });
        }

        else{
          this.recipe.imageURL = this.invalidImageURL;
          this.loading = true;

          this.sendUpdateRequest();
        }
      }
      else{
        this.sendUpdateRequest();
      }});
  }

  sendUpdateRequest(){
    this.recipeService.updateRecipe(this.recipe).subscribe((recipe) => {this.recipeService.emitRecipeUpdate(recipe)},
      (error) => {this.error = error.error.message; this.updateLoad = false;},
      () => {this.router.navigate(['/home']);});
  }

  createIngredient(): void{
    const ingredientData = this.ingredientForm.value;
    const ingredient: IngredientEntry = {
      ID: 0,
      name: ingredientData.name,
      amount: ingredientData.amount,
      measurementUnit: ingredientData.measurementUnit
    }

    this.ingredients.push(ingredient);
    this.recipeForm.patchValue({ingredients: this.ingredients});
    this.ingredientForm.reset();
  }

  removeIngredient(ingredient: IngredientEntry): void{
    var index: number = this.ingredients.indexOf(ingredient);
    if (index !== -1) {this.ingredients.splice(index, 1);}
    this.recipeForm.patchValue({ingredients: this.ingredients});
  }

  clearPreviousImage(){
    this.imageURL = this.invalidImageURL;
    this.changed = true;
  }

  goBack(): void{
    this.location.back();
  }

}
