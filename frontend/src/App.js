import React, { useState, useEffect } from 'react';
import './App.css';
import { FaCocktail } from 'react-icons/fa';

function App() {
  // Set Constant Or Default Values
  const [cocktails, setCocktails] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCocktail, setSelectedCocktail] = useState(null);

  // Fetch Cocktails From The Backend
  useEffect(() => {
    fetch('http://jistammen.github.io/api/cocktails/')
      .then(response => response.json())
      .then(data => setCocktails(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  // Normalize And Remove Diacritics From A String
  function normalize(str) {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
  }

  // Create A Constant To Hold The Sorted Cocktails Array Alphabetically By Name
  // const sortedCocktails = [...cocktails].sort((a, b) => a.name.localeCompare(b.name));

  // Filter Cocktails By Name Or Ingredients
  const filteredCocktails = cocktails.filter(cocktail => {
  // const filteredCocktails = sortedCocktails.filter(cocktail => {
    // Normalize the search term
    const normalizedSearchTerm = normalize(searchTerm);
    // Check If Any Cocktail Matches The Search Term
    const nameMatch = normalize(cocktail.name).includes(normalizedSearchTerm);
    // Check If Any Ingredient Matches The Search Term
    const ingredientMatch = cocktail.ingredients.some(ingredient =>
      normalize(ingredient.ingredient).includes(normalizedSearchTerm)
    );
    // Check If Any Base Spirit Matches The Search Term
    const base_spiritMatch = normalize(cocktail.base_spirit).includes(normalizedSearchTerm);
    // Check If Any Category Matches The Search Term
    const categoryMatch = normalize(cocktail.category).includes(normalizedSearchTerm);
    // Return True If Any Of The Above Matches The Search Term
    return nameMatch || ingredientMatch || base_spiritMatch || categoryMatch;
  });

  // Sort functions
  // const sortByName = () => {
  //   const sorted = [...cocktails].sort((a, b) => a.name.localeCompare(b.name));
  //   setCocktails(sorted);
  // };

  // const sortByBaseSpirit = () => {
  //   const sorted = [...cocktails].sort((a, b) => a.base_spirit.localeCompare(b.base_spirit));
  //   setCocktails(sorted);
  // };

  return (
    <div className="App">
      <h1><FaCocktail /> Cocktail Recipes</h1>

      <input
        type="text"
        placeholder="Search For Cocktails Or Ingredients..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-bar"
      />

      {/* Sorting Buttons
      <div className="sort-buttons">
        <button onClick={sortByName} className="sort-button">Sort by Name</button>
        <button onClick={sortByBaseSpirit} className="sort-button">Sort by Base Spirit</button>
      </div> */}

      <div className="cocktail-list">
        {filteredCocktails.map((cocktail, index) => (
          <div
            key={index}
            className="cocktail-card"
            onClick={() => setSelectedCocktail(cocktail)}
          >
            <h2 className="cocktail-name">{cocktail.name}</h2>
            <p className="cocktail-description">{cocktail.description}</p>
            <p className="category">Category: {cocktail.category}</p>
            <p className="base-spirit">Base Spirit: {cocktail.base_spirit}</p>
          </div>
        ))}
      </div>

      {selectedCocktail && (
        <div className="modal-overlay" onClick={() => setSelectedCocktail(null)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>{selectedCocktail.name}</h2>
            <p>{selectedCocktail.description}</p>
            <p><strong>History:</strong> {selectedCocktail.history}</p>
            <p><strong>Reco-my-dations:</strong> {selectedCocktail.recommendations}</p>
            <p><strong>Instructions:</strong> {selectedCocktail.instructions}</p>
            <h3>Ingredients:</h3>
            <ul className="ingredients-list">
              {selectedCocktail.ingredients.map((ingredient, i) => (
                <li key={i} className="ingredient-item">
                  {ingredient.amount} of {ingredient.ingredient}
                </li>
              ))}
            </ul>
            <button onClick={() => setSelectedCocktail(null)} className="close-button">Close</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
