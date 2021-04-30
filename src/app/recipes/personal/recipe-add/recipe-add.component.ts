import {Component, HostListener, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {RecipeService} from "../../shared/recipe.service";
import {Location} from "@angular/common";
import {Router} from "@angular/router";
import {Recipe} from "../../../shared/models/recipe";
import {Select} from "@ngxs/store";
import {LoginState} from "../../../login/shared/state/login.state";
import {interval, Observable, Subscription} from "rxjs";
import {User} from "../../../shared/models/user";
import {IngredientEntry} from "../../../shared/models/ingredient-entry";
import {Category} from "../../../shared/models/category";
import {take} from "rxjs/operators";
import {
  faBacon,
  faChevronCircleLeft, faCocktail, faCoffee, faCookie, faFish,
  faHamburger,
  faHotdog,
  faPizzaSlice,
  faUtensils, faWineBottle
} from "@fortawesome/free-solid-svg-icons";
import {Icon} from "@fortawesome/fontawesome-svg-core";

@Component({
  selector: 'app-recipe-add',
  templateUrl: './recipe-add.component.html',
  styleUrls: ['./recipe-add.component.scss']
})
export class RecipeAddComponent implements OnInit {

  @HostListener("window:beforeunload", ["$event"]) unloadHandler(event: Event) {
    this.ngOnDestroy();
  }

  imageURL: string = '';
  invalidImageURL: string = 'https://firebasestorage.googleapis.com/v0/b/eb-sdm3.appspot.com/o/NoImage.png?alt=media&token=9f213b80-6356-4f8e-83b6-301936912a6e';
  loading: boolean = true;
  imageLoad: boolean = false;
  error: string = '';

  ingredients: IngredientEntry[] = [];
  categories: Category[] = [];

  @Select(LoginState.user)
  loggedUser$: Observable<User> | undefined;
  created: boolean = false;

  selectedIcon = null
  randomIcons = [faUtensils, faHamburger, faPizzaSlice, faBacon, faHotdog, faFish, faCookie, faCocktail, faWineBottle, faCoffee]
  circleLeft = faChevronCircleLeft;
  iconRandomSelect: Subscription;

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
    amount: new FormControl('', [Validators.required, Validators.min(1), Validators.max(10000)]),
    measurementUnit: new FormControl('', [Validators.required, Validators.minLength(1), Validators.maxLength(20)]),
  });

  constructor(private recipeService: RecipeService, private location: Location,
              private router: Router)
  {
    const source = interval(2000);
    this.iconRandomSelect = source.subscribe(val => this.selectRandomIcon());
  }

  ngOnInit(): void {
    this.imageURL = (localStorage.getItem('loadedImage') !== null) ? JSON.parse(localStorage.getItem('loadedImage')).image : '';
    this.getCategories();
    this.selectRandomIcon();
  }

  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories;}, (error) => {this.error = error.error.message; this.loading = false;}, () => {this.loading = false;})
  }

  createRecipe(): void{

    this.loading = true;

    const recipeData = this.recipeForm.value;
    this.imageURL = (this.imageURL === '') ? this.invalidImageURL : this.imageURL;

    this.loggedUser$.pipe(take(1)).subscribe((user) => {

      const recipe: Recipe = {
        ID: 0,
        title: recipeData.title,
        description: recipeData.description,
        preparations: recipeData.preparations,
        imageURL: this.imageURL,
        user: user,
        ingredientEntries: recipeData.ingredients,
        category: {ID: recipeData.category, title: ''},
        personalRating: 0,
        averageRating: 0,
        isFavorite: false
      }

      this.recipeService.addRecipe(recipe).subscribe((createdRecipe) => {},
        (error) => {this.error = error.error.message; this.loading = false;},
        () => {this.created = true; this.router.navigate(['home']);});
    });
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

  deleteImage(){
    this.imageLoad = true;

    let imageTitle: string = this.imageURL.substring(
      this.imageURL.lastIndexOf("/o/") + 3,
      this.imageURL.lastIndexOf("?alt")
    );

    let imageToDelete = {image: imageTitle}

    this.recipeService.deleteImage(imageToDelete).subscribe((response) => {},
      (error) => {this.imageLoad = false; this.error = error.error.messages;},
      () => {
        this.recipeForm.patchValue({imageURL: ''});
        this.imageURL = '';
        this.imageLoad = false;
      });
  }

  onFileChange(event){

    if(event.target.files.length === 0){
      if(this.imageURL !== ''){
        this.deleteImage();}

    }else{

      this.imageLoad = true;

      if(this.imageURL !== ''){
        this.deleteImage();
      }

      let selectedFile: File = <File>event.target.files[0];

      this.recipeService.uploadImage(selectedFile).subscribe((response) => {
          let urls: string[] = response.message;
          this.imageURL = urls[0];},
        (error) => {this.error = error.error;}, () => {this.imageLoad = false;});
    }
  }

  selectRandomIcon(){
    const randomPosition = Math.floor(Math.random() * (this.randomIcons.length - 1));
    this.selectedIcon = this.randomIcons[randomPosition];
  }

  goBack(): void{
    this.location.back();
  }

  ngOnDestroy(): void{
    if(!this.created && this.imageURL !== ''){localStorage.setItem('loadedImage', JSON.stringify({image: this.imageURL}))}
    else{localStorage.removeItem('loadedImage')}
    this.iconRandomSelect.unsubscribe();
  }

}
