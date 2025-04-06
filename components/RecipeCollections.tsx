'use client';

import React, { useState, useEffect } from "react";

const difficulties = ["Easy", "Medium", "Hard"];

export default function RecipeCollections() {
  const [expanded, setExpanded] = useState(null);
  const [recipes, setRecipes] = useState([]);

  useEffect(() => {
    fetch("/data/recipes.json")
      .then((res) => res.json())
      .then((data) => setRecipes(data));
  }, []);

  return (
    <div className="p-4 space-y-8">
      {difficulties.map((level) => (
        <div key={level}>
          <h2 className="text-2xl font-bold mb-6 text-gray-800 border-b pb-2">{level} Recipes</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recipes.filter((r) => r.difficulty === level).map((recipe, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl shadow-md overflow-hidden transition-transform duration-300 transform hover:scale-105"
                onClick={() => setExpanded(expanded === idx ? null : idx)}
              >
                <div className="h-48 overflow-hidden">
                  <img
                    src={recipe.image}
                    alt={recipe.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4">
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">{recipe.title}</h3>
                  {expanded === idx && (
                    <pre className="whitespace-pre-wrap text-sm text-gray-700 mt-2">{recipe.content}</pre>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
