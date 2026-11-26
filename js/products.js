import { updateCartNavCount, displayProduct, initProductEvents } from "./utils.js";

let selectedIcon = document.querySelector(".filter_select_box .selected i.bx");
let selectedText = document.querySelector(".filter_select_box .selected span");
let selectBox = document.querySelector("#filter_box");
let selectElements = document.querySelectorAll(".filter_box_item");
let selected = document.querySelector(".filter_select_box");

/* -------------- Toggle Select Box of Categories  ------------------- */
selected.addEventListener("click", function () {
    if (!selectBox.classList.contains("show")) {
        selectedIcon.classList.remove("bx-caret-right");
        selectedIcon.classList.add("bx-caret-down");
        selectBox.classList.add("show");
    } else {
        selectedIcon.classList.add("bx-caret-right");
        selectedIcon.classList.remove("bx-caret-down");
        selectBox.classList.remove("show");
    }
});


// Select elements
const productsContainer = document.querySelector(".all_products_items");
const searchInput = document.getElementById("search");
const filterBox = document.getElementById("filter_box");
const sortSelect = document.getElementById("sort");

// Get products & categories from localStorage
const products = JSON.parse(localStorage.getItem("products")) || [];
const categories = JSON.parse(localStorage.getItem("categories")) || []; // Extract unique categories
let selectedCategory = null;
let currentSearch = "";

// Function to display products
const displayProducts = (filteredProducts) => {
    productsContainer.innerHTML = ""; // Clear existing products

    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    filteredProducts.forEach(product => {
        const productHTML = displayProduct(product)
        productsContainer.innerHTML += productHTML;
    });
};

const applyFilters = () => {
    let filteredProducts = [...products];

    // Filter by category
    if (selectedCategory) {
        filteredProducts = filteredProducts.filter(
            product => product.category === selectedCategory
        );
    }

    // Filter by search
    if (currentSearch) {
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(currentSearch) ||
            product.category.toLowerCase().includes(currentSearch)
        );
    }

    // Sort products
    switch (sortSelect.value) {
        case "price-asc":
            filteredProducts.sort((a, b) => Number(a.price) - Number(b.price));
            break;

        case "price-desc":
            filteredProducts.sort((a, b) => Number(b.price) - Number(a.price));
            break;

        case "name-asc":
            filteredProducts.sort((a, b) =>
                a.name.localeCompare(b.name)
            );
            break;
    }

    displayProducts(filteredProducts);
};


// Function to load categories dynamically
const loadCategories = () => {
    filterBox.innerHTML = ""; // Clear existing categories
    categories.forEach(category => {
        const categoryItem = document.createElement("li");
        categoryItem.classList.add("filter_box_item");
        categoryItem.textContent = category.name;
        categoryItem.addEventListener("click", () => {
    selectedCategory = category.name;
    applyFilters();
});
        filterBox.appendChild(categoryItem);
    });
};

// Initial display
applyFilters();
// Load categories dynamically
loadCategories();
// Update Navbar Cart total items when load
updateCartNavCount()
// initialize Product Events
initProductEvents(productsContainer);


// Search functionality
searchInput.addEventListener("input", () => {
    currentSearch = searchInput.value.toLowerCase();
    applyFilters();
});
sortSelect.addEventListener("change", applyFilters);
