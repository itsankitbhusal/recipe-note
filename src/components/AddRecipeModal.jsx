import { useEffect } from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";

import ErrorMessage from "./ErrorMessage";

const AddRecipeModal = ({
  isOpen,
  onClose,
  onSave,
  recipeData,
  updateData,
}) => {
  const [recipe, setRecipe] = useState({});

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (updateData) {
      setRecipe(updateData[0]);
    } else {
      console.log("no data caught");
    }
  }, [updateData]);

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
        [name]: value,
      });
    }
  };

  const handleSave = (data) => {
    onSave(data);
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
          <form onSubmit={handleSubmit(handleSave)}>
            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
              <div className="sm:flex sm:items-start">
                <div className="mt-3 w-full text-center sm:mt-0 sm:ml-4 sm:text-left">
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
                      {...register("title", {
                        required: true,
                        minLength: 4,
                        maxLength: 150,
                      })}
                      className="mt-2 p-2 w-full border border-gray-300 rounded"
                    />
                    {errors.title && errors.title.type === "required" && (
                      <ErrorMessage message="Title is required!" />
                    )}
                    {errors.title && errors.title.type === "minLength" && (
                      <ErrorMessage message="Minimum length id 4 chars!" />
                    )}
                    {errors.title && errors.title.type === "maxLength" && (
                      <ErrorMessage message="Minimum length id 150 chars!" />
                    )}
                    <textarea
                      name="description"
                      id="description"
                      placeholder="Recipe Description"
                      onChange={handleInputChange}
                      value={recipe.description}
                      {...register("description", {
                        required: true,
                        minLength: 150,
                        maxLength: 3000,
                      })}
                      className="mt-2 p-2 w-full border border-gray-300 rounded"
                    />
                    {errors.description &&
                      errors.description.type === "required" && (
                        <ErrorMessage message="Description is required!" />
                      )}
                    {errors.description &&
                      errors.description.type === "minLength" && (
                        <ErrorMessage message="Minimum length id 150 chars!" />
                      )}
                    {errors.description &&
                      errors.description.type === "maxLength" && (
                        <ErrorMessage message="Minimum length id 3000 chars!" />
                      )}
                    <input
                      type="text"
                      name="ingredients"
                      id="ingredients"
                      placeholder="Ingredients (comma-separated)"
                      onChange={handleInputChange}
                      value={recipe.ingredients}
                      {...register("ingredients", {
                        required: true,
                        minLength: 4,
                      })}
                      className="mt-2 p-2 w-full border border-gray-300 rounded"
                    />
                    {errors.ingredients &&
                      errors.ingredients.type === "required" && (
                        <ErrorMessage message="Ingredients is required!" />
                      )}
                    {errors.ingredients &&
                      errors.ingredients.type === "minLength" && (
                        <ErrorMessage message="Minimum length id 4 chars!" />
                      )}
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
                type="submit"
                className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Save
              </button>
              <button
                onClick={() => {
                  setRecipe({});
                  onClose();
                }}
                type="button"
                className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddRecipeModal;
