<template>
	<div class="container">

		<!-- Logo and tagline -->
		<div class="row header">
				<img id="subsecLogo" src="../assets/subsec.jpg">
				<h3>SubSec Recipes</h3>
		</div>

		<!-- Filter fields -->
		<div class="row">
			<div class="row filterOptions">
				<input
					v-model="filters.name" 
					v-on:keyup="getRecipeListFromBackend"
					placeholder="Search recipes by name"
				></input>
				<input 
					v-model="filters.cookingTime" 
					v-on:keyup="getRecipeListFromBackend"
					placeholder="Search recipes by cooking time"
				></input>
				<input 
					v-model="filters.ingredients" 
					v-on:keyup="getRecipeListFromBackend"
					placeholder="Search recipes by ingredients"
				></input>
			</div>
		</div>

		<!-- Recipe list -->
		<div class="row recipeListRow">

			<!-- If the network call fails/api returns an error, display it -->
			<div class="recipeApiError" v-if="recipeApi.error">
				<h3>{{recipeApi.msg}}</h3>
			</div>

			<!-- Otherwise, display the list of recipes returned by the API -->
			<div class="row recipeRow" v-for="recipe in recipes" v-else>
					<div class="col-md-2 col-md-offset-2 recipeDetail">
						<img class="recipeImg" :src="recipe.imageUrl">
					</div>
					<div class="col-md-2"><p>{{ recipe.name }}</p></div>
					<div class="col-md-2"><p>{{ recipe.cookingTime }}</p></div>
					<div class="col-md-2"><p>{{ recipe.ingredients.join(', ') }}</p></div>
			</div>

		</div>

	</div>
</template>

<script>

const queryString = require('querystring');

export default {
	name: 'Home',
	components: { },
	data() {
		return {
			recipeListRoute: 'recipe/list',
			recipeApi: {
				error: false,
				msg: ''
			},
			/* 
				These properties are bound to the respective inputs in the HTML template.
				As the user types in the field, the respective prop here updates to reflect the value.
			*/
			filters: {
				name: '',
				cookingTime: '',
				ingredients: ''
			}
		}
	},

	/* Immediately we call the API to retrieve the complete list of recipes */
	created () {
		this.getRecipeListFromBackend();
	},
	
	methods: {

		getRecipeListFromBackend() {
			/* If any filters are set, append the filters to the route as a query string */
			let route = this.recipeListRoute;
			const filtersAreSet = this.isAnyFilterSet();
			if(filtersAreSet) {
				const filterParams = queryString.stringify(this.filters);
				const queryStr = `?${filterParams}`;
				route = route.concat(queryStr);
			}

			/* 
				Otherwise, send no filters, and expect the API to return a complete, unfiltered list of recipes 
				(We do this in the `created` hook, above - because by default no filters are applied.)
			*/
			this.$http.get(route).then((res) => {
				const recipes = res.body;
				if(recipes.length < 1) {
					this.recipeApi.error = true;
					this.recipeApi.msg = (filtersAreSet) 
						? 'Sorry, nothing matched your filter term.' 
						: 'Sorry, we currently have no recipes for you.';
					return;
				}

				/* Add the recipes to store; hide errors */
				this.$store.commit('setRecipes', recipes);
				this.recipeApi.error = false;
				this.recipeApi.msg = '';

			}).catch((res) => {
				this.handleApiError(res);
			});
		},

		isAnyFilterSet() {
			for(const key in this.filters) {
				const val = this.filters[key].trim();
				if(val.trim() != '') return true;
			}
			return false;
		},

		handleApiError(res) {
			console.log(res);
			this.recipeApi.error = true;
			if(res.status === 0) {
				this.recipeApi.msg = 'There was a network error. Please try again.';
			} else {
				this.recipeApi.msg = 'There was an unexpected error. Please try again.';
			}
		}

	},

	computed: {

		/* 
			To retrieve the recipes from the store, we set a computed property. We reference this 
			property in the HTML template, where we iterate over the recipes array to render each recipe to the list
		*/
		recipes() {
			return this.$store.getters.getRecipes;
		}

	}
}
</script>

<style scoped>

	.container {
		margin: none;
		padding-top: 50px;
	}

	.header {
		padding-bottom: 30px;
	}

	#subsecLogo {
		height: 100px;
		width: auto
	}

	.recipeListRow {
		justify-content: center;
	}

	.recipeRow {
		padding-bottom: 30px;
	}

	.filterOptions {
		padding-bottom: 50px;
	}

	.recipeImg {
		height: 50px;
	}

	input {
		height: 30px;
		width: 200px;
		padding-left: 8px;
		margin-top: 2px;
		margin-left: 10px;
		border: 1px solid black;
		font-size: 12px;
		outline: none;
		background-color: white !important;
		border-radius: 3px;
	}

</style>
