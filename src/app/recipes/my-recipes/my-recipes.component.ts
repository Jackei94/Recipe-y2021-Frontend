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
import {faEdit, faTrashAlt} from "@fortawesome/free-solid-svg-icons";
import {UserService} from "../../shared/services/user.service";

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

  modalRef: BsModalRef;
  selectedRecipe: Recipe;

  unsubscriber$ = new Subject();

  editIcon = faEdit;
  deleteIcon = faTrashAlt;

  constructor(private recipeService: RecipeService, private route: ActivatedRoute,
              private authService: AuthenticationService, private modalService: BsModalService,
              private userService: UserService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getRecipes()});

    this.userID = this.authService.getID();

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

  }

  getRecipes(): void {

    if(this.profileView)
    {
      const filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
        + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}&userID=${this.profileID}`;
      this.loading = true;

      this.recipeService.getRecipes(filter).subscribe((FilterList) => {
        this.totalItems = FilterList.totalItems;
        this.recipes = FilterList.list;
      }, error => {this.loading = false; console.log(error.error.message);}, () => {this.loading = false; });
    }

    else {
      const filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
        + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}&userID=${this.userID}`;
      this.loading = true;

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

  openDeleteModal(template: TemplateRef<any>, recipeToDelete: Recipe) {
    this.selectedRecipe = recipeToDelete;
    this.modalRef = this.modalService.show(template);
  }

  ngOnDestroy(): void {
    this.unsubscriber$.next();
    this.unsubscriber$.complete();
  }
}
