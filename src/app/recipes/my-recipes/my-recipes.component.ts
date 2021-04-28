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

@Component({
  selector: 'app-my-recipes',
  templateUrl: './my-recipes.component.html',
  styleUrls: ['./my-recipes.component.scss']
})
export class MyRecipesComponent implements OnInit, OnDestroy {

  recipes: Recipe[];
  categories: Category[];
  loading: boolean = true;
  id: number;

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

  constructor(private recipeService: RecipeService, private route: ActivatedRoute,
              private authService: AuthenticationService, private modalService: BsModalService) { }

  ngOnInit(): void {
    this.searchTerms.pipe(debounceTime(300), distinctUntilChanged(),).
    subscribe((search) => {this.searchTerm = search; this.getRecipes()});

    this.id = this.authService.getID();
    this.getCategories();
    this.getRecipes();

    this.recipeService.listenForUpdateChange().pipe(takeUntil(this.unsubscriber$)).
    subscribe((recipe) => {
        const placement = this.recipes.findIndex((r) => r.ID === recipe.ID)
        if(placement !== -1){this.recipes[placement] = recipe;}},
      (error) => {});

    this.recipeService.listenForCreate().pipe(takeUntil(this.unsubscriber$)).
    subscribe(() => {this.getRecipes();}, (error) => {});

  }

  getRecipes(): void {
    const filter = `?currentPage=${this.currentPage}&itemsPrPage=${this.itemsPrPage}&name=${this.searchTerm}`
      + `&sortingType=${this.sortingType}&sorting=${this.sorting}&category=${this.recipeCategory}&userID=${this.id}`;
    this.loading = true;

    this.recipeService.getRecipes(filter).subscribe((FilterList) => {
      this.totalItems = FilterList.totalItems;
      this.recipes = FilterList.list;
    }, error => {this.loading = false}, () => {this.loading = false; });
  }

  getCategories(): void{
    this.recipeService.getRecipeCategories().subscribe((categories) => {
      this.categories = categories;}, (error) => {}, () => {})
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

  deleteRecipe(recipeID: number): void{

    if(!this.selectedRecipe.imageURL.includes('NoImage.png')){
        let imageTitle: string = this.selectedRecipe.imageURL.substring(
        this.selectedRecipe.imageURL.lastIndexOf("/o/") + 3,
        this.selectedRecipe.imageURL.lastIndexOf("?alt")
      );

      let imageToDelete = {image: imageTitle}
      this.recipeService.deleteImage(imageToDelete).subscribe();
    }

    const userID = this.authService.getID();
    const recipeDeleteDTO: RecipeDeleteDto = {recipeID: recipeID, userID: userID}

    this.loading = true;

    this.recipeService.deleteRecipeByID(recipeDeleteDTO).subscribe((deleted) => {
      this.recipeService.emitRecipeDelete(this.selectedRecipe); this.getRecipes(); this.loading = false;},
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
