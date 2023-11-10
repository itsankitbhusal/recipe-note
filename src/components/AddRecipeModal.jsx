import { useState } from "react";

const AddRecipeModal = ({
  isOpen,
  onClose,
  onSave,
  recipeData,
  setRecipeData,
}) => {
  const [recipe, setRecipe] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "ingredients") {
      setRecipe({
        ...recipe,
        [name]: value.split(","),
      });
    } else {
      setRecipe({
        ...recipe,
        id: Math.floor(Math.random() * (recipeData.length + 1 + 1000)),
        // id: recipeData.length + 1,
        [name]: value,
      });
    }
  };

  const handleSave = (e) => {
    e.preventDefault();
    onSave(recipe);
    setRecipe({});
    onClose();
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed z-10 inset-0 overflow-y-auto">
      <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" aria-hidden="true">
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        <span
          className="hidden sm:inline-block sm:align-middle sm:h-screen"
          aria-hidden="true"
        >
          &#8203;
        </span>
        <div
          className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-headline"
        >
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3
                  className="text-lg leading-6 font-medium text-gray-900"
                  id="modal-headline"
                >
                  Add New Recipe
                </h3>
                <div className="mt-2">
                  <input
                    type="text"
                    name="title"
                    id="title"
                    placeholder="Recipe Title"
                    onChange={handleInputChange}
                    value={recipe.title}
                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                  />
                  <textarea
                    name="description"
                    id="description"
                    placeholder="Recipe Description"
                    onChange={handleInputChange}
                    value={recipe.description}
                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    name="ingredients"
                    id="ingredients"
                    placeholder="Ingredients (comma-separated)"
                    onChange={handleInputChange}
                    value={recipe.ingredients}
                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                  />
                  <input
                    type="text"
                    name="image"
                    id="image"
                    placeholder="Image URL"
                    onChange={handleInputChange}
                    value={recipe.image}
                    className="mt-2 p-2 w-full border border-gray-300 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button
              onClick={handleSave}
              type="button"
              className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Save
            </button>
            <button
              onClick={onClose}
              type="button"
              className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;
