import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap";
import "./style.css";

//  فصل الـ Fetching عن الـ Rendering   Important
// select from html

// Calling API
/*
1. getRecipes()
المسؤولية: Fetching Data
- تبعت Request للـ API.
- تتأكد إن الـ HTTP response ناجح.
- تحوّل الـ response إلى JSON.
- تجهّز بيانات الوصفات.

*/
const recipesContainer = document.querySelector("#recipes-container");
// const recipeDetails = document.querySelector("#recipe-details");
const searchForm = document.querySelector("#search-form");
const searchInput = document.querySelector("#search-input");

searchForm.addEventListener("submit", (e) => {
  e.preventDefault();
  const searchTerm = searchInput.value.trim();
  getRecipes(searchTerm);
});
// Calling APi

async function getRecipes(searchTerm = "pizza") {
  try {
    recipesContainer.innerHTML = `
  <div class="col-12 text-center py-4">
    <p class="text-secondary">Loading recipes...</p>
  </div>
`;
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchTerm}`,
    );
    if (!response.ok) {
      throw new Error(`Error : ${response.status}`);
    }
    const data = await response.json();
    const meals = data.meals;
    if (meals !== null) {
      const recipes = meals.map((meal) => {
        return {
          mealName: meal.strMeal,
          mealImg: meal.strMealThumb,
          mealId: meal.idMeal,
        };
      });
      displayRecipes(recipes);
    } else {
      recipesContainer.innerHTML = `
    <div class="col-12 text-center py-5">
      <h3 class="fw-bold mb-2">No recipes found</h3>
      <p class="text-secondary mb-0">
        Try another recipe name.
      </p>
    </div>
  `;
    }
  } catch (error) {
    console.error(error);

    recipesContainer.innerHTML = `
    <div class="col-12 text-center py-4">
      <p class="text-danger">
        Something went wrong. Please try again.
      </p>
    </div>
  `;
  }
}
/*
async function getRecipeDetails(mealId) {
  try {
    const response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`,
    );
    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }
    const data = await response.json();
    const meal = data.meals[0];
    displayRecipesDetails(meal);
  } catch (error) {
    console.error(error);
  }
}
*/
//end Call APi

function displayRecipes(recipes) {
  recipesContainer.innerHTML = recipes
    .map(
      (meal) =>
        `
    <div class="col-12 col-sm-6 col-lg-4">
  <div class="card h-100">
    <img src="${meal.mealImg}" class="card-img-top" alt="${meal.mealName}" />
    <div class="card-body">
      <h5 class="card-title">${meal.mealName}</h5>
      <button type="button" data-id='${meal.mealId}' class="btn btn-success">View Recipe</button>
    </div>

  </div>
</div>
`,
    )
    .join("");
}

/*
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
*/
/*
الخطوة الجاية: Event Delegation
بدل ما نضيف Event Listener لكل زرار لوحده، هنستخدم Event Delegation على recipesContainer

*/
recipesContainer.addEventListener("click", (e) => {
  if (e.target.matches("button")) {
    const mealId = e.target.dataset.id;
    window.location.href = `/recipe.html?id=${mealId}`;
  }
});

getRecipes();
