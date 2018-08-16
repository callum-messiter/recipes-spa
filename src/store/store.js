import Vue from 'vue';
import Vuex from 'vuex';
Vue.use(Vuex);

export default new Vuex.Store({
	state: {
		recipes: []
	},

	getters: {
		getRecipes(state) {
			return state.recipes;
		}
	},

	mutations: {
		setRecipes(state, recipes) {
			state.recipes = recipes;
		}
	},

	actions: {},
});