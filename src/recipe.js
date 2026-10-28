import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./style.css";

const recipeDetails = document.querySelector("#recipe-details");
const mealId = new URLSearchParams(window.location.search).get("id");

// Fetch
async function getRecipeDetails(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    if (!data.meals) {
      recipeDetails.innerHTML =
        "<p>Recipe not found. Please go back and choose another recipe.</p>";
      return;
    }
    const meal = data.meals[0];
    displayRecipesDetails(meal);
  } catch (error) {
    console.error(error);

    recipeDetails.innerHTML = `
    <div class="alert alert-danger mt-4" role="alert">
      Failed to load the recipe. Please try again.
    </div>
  `;
  }
}
// End Fetch

// Render
function displayRecipesDetails(meal) {
  const ingredients = [];

  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`]?.trim();
    const measure = meal[`strMeasure${i}`]?.trim();

    if (ingredient) {
      ingredients.push(`<li>${measure ? `${measure} ` : ""}${ingredient}</li>`);
    }
  }

  const ingredientsHTML = ingredients.join("");

  recipeDetails.innerHTML = `
    <div class="card shadow-sm mt-4">
  <div class="row g-0">
    <!-- Recipe Image -->
    <div class="col-12 col-md-5">
      <img
        src="${meal.strMealThumb}"
        class="img-fluid rounded-start w-100 h-100 object-fit-cover"
        alt="${meal.strMeal}"
      />
    </div>

    <!-- Recipe Content -->
    <div class="col-12 col-md-7">
      <div class="card-body p-4">
        <h2 class="card-title mb-3">${meal.strMeal}</h2>

        <!-- Ingredients -->
        <h4>Ingredients</h4>
<ul>
  ${ingredientsHTML}
</ul>

        <!-- Instructions -->
        <h4 class="mt-4">Instructions</h4>
        <p>${meal.strInstructions}</p>
      </div>
    </div>
  </div>
</div>
    `;
}
// End Render

if (mealId) {
  getRecipeDetails(mealId);
} else {
  recipeDetails.innerHTML =
    "<p>No recipe selected. Please go back and choose a recipe.</p>";
}
