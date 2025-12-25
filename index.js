const mealContainer = document.getElementById("meal-container");
const modal = document.getElementById("meal-modal");
const modalContent = document.getElementById("modal-content");
const closeModal = document.getElementById("close-modal");
const searchInput = document.getElementById("search-input");
const searchBtn = document.getElementById("search-btn");

//LOAD MEALS
async function loadMeals(searchText = "") {
  // Loader
  mealContainer.innerHTML = `
    <div class="grid items-center col-span-4 justify-center min-h-screen">
      <div class="flex flex-col items-center gap-3">
        <div class="w-12 h-12 border-4 border-[#f4b41a] border-t-transparent rounded-full animate-spin"></div>
        <p class="text-gray-600 font-medium">Loading...</p>
      </div>
    </div>
  `;

  try {
    const res = await fetch(
      `https://www.themealdb.com/api/json/v1/1/search.php?s=${searchText}`
    );
    const data = await res.json();
    const meals = data.meals;

    mealContainer.innerHTML = "";

    if (!meals) {
      mealContainer.innerHTML = `
        <p class="col-span-4 text-center text-gray-500">
          No meals found 
        </p>
      `;
      return;
    }

    meals.forEach(meal => {
      const card = document.createElement("div");

      card.innerHTML = `
        <div class="card">
          <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
          <div class="card-body">
            <h3>${meal.strMeal}</h3>
            <p>${meal.strCategory}</p>
            <a class="view-btn">VIEW DETAILS</a>
          </div>
        </div>
      `;

      card.querySelector(".view-btn").addEventListener("click", () => {
        openModal(meal);
      });

      mealContainer.appendChild(card);
    });

  } catch (error) {
    mealContainer.innerHTML = "Failed to load meals ";
    console.error(error);
  }
}

//MODAL
function openModal(meal) {
  modal.classList.remove("hidden");
  modal.classList.add("flex");

  modalContent.innerHTML = `
    <div class="modalCard">
      <img src="${meal.strMealThumb}" class="h-56 w-full rounded object-cover" />
      <h2 class="mt-4 text-2xl font-bold">${meal.strMeal}</h2>
      <p class="mt-2"><strong>Category:</strong> ${meal.strCategory}</p>
      <p><strong>Area:</strong> ${meal.strArea}</p>
      <p class="mt-3 text-sm">
        <strong>Descriptions:</strong>
        ${meal.strInstructions.slice(0, 500)}...
      </p>
    </div>
  `;
}

// Close modal (button)
closeModal.addEventListener("click", () => {
  modal.classList.add("hidden");
  modal.classList.remove("flex");
});

// Close modal (outside click)
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    modal.classList.add("hidden");
    modal.classList.remove("flex");
  }
});

//SEARCH
searchBtn.addEventListener("click", () => {
  loadMeals(searchInput.value.trim());
});

searchInput.addEventListener("keyup", (e) => {
  if (e.key === "Enter") {
    loadMeals(searchInput.value.trim());
  }
});

// Initial load
loadMeals();

