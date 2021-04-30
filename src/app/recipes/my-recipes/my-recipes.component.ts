import {Component, OnDestroy, OnInit, TemplateRef} from '@angular/core';
import {Recipe} from '../../shared/models/recipe';
import {Category} from '../../shared/models/category';
import {Subject} from 'rxjs';
import {RecipeService} from '../shared/recipe.service';
import {ActivatedRoute} from '@angular/router';
import {debounceTime, distinctUntilChanged, takeUntil} from 'rxjs/operators';
import {AuthenticationService} from '../../shared/services/authentication.service';
import {BsModalRef, BsModalService} from "ngx-bootstrap/modal";
import {RecipeDeleteDto} from "../shared/dtos/recipe.delete.dto";
import {faEdit, faHeart, faHeartBroken, faStar, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../shared/services/user.service";
import {FavoriteDto} from "../shared/dtos/favorite.dto";

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit, OnDestroy {

  recipes: Recipe[] = [];
  categories: Category[];
  loading: boolean = true;
  error: string = ''

  userID: number | undefined;
  profileID: number = 0;
  profileView: boolean = false;
  username: string = ''
  found: boolean = true;

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

  modalRef: BsModalRef;
  selectedRecipe: Recipe;

  unsubscriber$ = new Subject();

  editIcon = faEdit;
  deleteIcon = faTrashAlt;
  starIcon = faStar;
  likeIcon = faHeart;
  dislikeIcon = faHeartBroken;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute,
              private authService: AuthenticationService, private modalService: BsModalService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getRecipes()});

    this.userID = this.authService.getID();
    this.userService.joinPersonalRoom(this.userID);

    if(this.route.snapshot.paramMap.get('id') != null){
      this.profileID = +this.route.snapshot.paramMap.get('id');
      this.profileView = true;
      this.loadProfile();

      this.recipeService.listenForDeleteChange().pipe(takeUntil(this.unsubscriber$)).subscribe((recipe) => {
        this.getRecipes();});
    }
    else{
      this.getCategories();
      this.getRecipes();
    }

    this.recipeService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((recipe) => {
        const placement = this.recipes.findIndex((r) => r.ID === recipe.ID)
        if(placement !== -1){this.recipes[placement] = recipe;}});

    this.recipeService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {this.getRecipes();});

    this.recipeService.listenForFavoriteUpdate().pipe(takeUntil(this.unsubscriber$)).
    subscribe((favoriteDTO) => {this.getRecipes()});

  }

  getRecipes(): void {

    let filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
      + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}`;

    if(this.profileView)
    {
      filter += `&userID=${this.profileID}`;
      if(this.userID) {filter += `&userIDFavorite=${this.userID}&showFavorites=${this.showFavorites}`;}
    }

    else {filter += `&userID=${this.userID}&userIDFavorite=${this.userID}&showFavorites=${this.showFavorites}`;}

    if(this.profileView && !this.userID){
      this.recipeService.getRecipes(filter).subscribe((FilterList) => {
        this.totalItems = FilterList.totalItems;
        this.recipes = FilterList.list;
      }, error => {this.loading = false;}, () => {this.loading = false; });
    }
    else{
      this.recipeService.getPersonalRecipes(filter).subscribe((FilterList) => {
        this.totalItems = FilterList.totalItems;
        this.recipes = FilterList.list;
      }, error => {this.loading = false}, () => {this.loading = false; });
    }
  }


















  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories;}, (error) => {}, () => {})
  }

  loadProfile(): void{
    this.userService.getUsername(this.profileID).subscribe((userInfoDTO) => {
      this.username = userInfoDTO.username;
      this.getCategories();
      this.getRecipes();},
      (error) => {this.error = error.error.message; this.loading = false; this.found = false;});
  }

  deleteRecipe(recipe: Recipe): void{

    if(!this.selectedRecipe.imageURL.includes('NoImage.png')){
        let imageTitle: string = this.selectedRecipe.imageURL.substring(
        this.selectedRecipe.imageURL.lastIndexOf("/o/") + 3,
        this.selectedRecipe.imageURL.lastIndexOf("?alt")
      );

      let imageToDelete = {image: imageTitle}
      this.recipeService.deleteImage(imageToDelete).subscribe();
    }

    const userID = this.authService.getID();
    const recipeDeleteDTO: RecipeDeleteDto = {recipe: recipe, userID: userID}

    this.loading = true;

    this.recipeService.deleteRecipeByID(recipeDeleteDTO).subscribe((deleted) => {
      this.getRecipes(); this.loading = false;},
      error => {this.loading = false;});
  }

  favoriteRecipe(recipeID: number): void{
    const favoriteDTO: FavoriteDto = {favorite: true, recipeID: recipeID, userID: this.userID}
    this.recipeService.favoriteRecipe(favoriteDTO).subscribe(() => {});
  }

  unfavoriteRecipe(recipeID: number): void{
    const favoriteDTO: FavoriteDto = {favorite: false, recipeID: recipeID, userID: this.userID}
    this.recipeService.unfavoriteRecipe(favoriteDTO).subscribe(() => {});
  }

  openDeleteModal(template: TemplateRef<any>, recipeToDelete: Recipe) {
    this.selectedRecipe = recipeToDelete;
    this.modalRef = this.modalService.show(template);
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
