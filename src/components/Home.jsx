import { useState, useEffect } from "react";
import AddRecipeModal from "./AddRecipeModal";
import RecipeDetail from "./RecipeDetail";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeData, setRecipeData] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = (recipe) => {
    const existingRecipe = recipeData.find((r) => +r.id === +recipe.id);
  
    if (existingRecipe) {
      const updateData = recipeData.map((r) =>
        r.id === recipe.id ? { ...r, ...recipe } : r
      );
      setRecipeData(updateData);
      localStorage.setItem("recipe", JSON.stringify(updateData));
    } else {
      const newData = [...recipeData, recipe];
      setRecipeData(newData);
      localStorage.setItem("recipe", JSON.stringify(newData));
    }
  };

  const handleDelete = (id) => {
    const confirmDelete = confirm("Are you sure you want to delete the recipe");
    if (confirmDelete) {
      const updatedRecipeData = recipeData.filter((data) => data.id !== id);
      setRecipeData(updatedRecipeData);
      localStorage.setItem("recipe", JSON.stringify(updatedRecipeData));
      toast.success("Recipe deleted successfully");
    }
  };

  const handleEdit = (id) => {
    if (!id) {
      toast.error("id not provided");
      return;
    }
    setIsOpen(true);
    setEditId(id);
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recipe"));
    if (data) {
      setRecipeData(data);
    }
  }, []);

  const handleTitleClick = (id) => {
    setSelectedId(id);
  };

  return (
    <div className="relative min-h-screen w-full grid place-items-center">
      {recipeData.length > 0 ? (
        <div className=" flex gap-8 w-10/12 min-h-[80vh] mt-12">
          <div className=" border-b-2 max-h-[80vh] overflow-x-auto w-4/12 px-8 py-4 min-h-full outline rounded outline-1 outline-gray-200">
            <div className=" border-b-[1px] mb-2">
              <div className=" mb-2  font-semibold tracking-tighter text-xl flex  justify-between items-center ">
                <h3>Recipe List</h3>
                <AiOutlinePlus
                  onClick={handleAdd}
                  className=" mr-1 hover:cursor-pointer text-gray-700 hover:rotate-180 transition-transform hover:text-gray-900 font-bold text-3xl"
                />
              </div>
            </div>
            {recipeData
              ? recipeData.map((recipe, index) => {
                  return (
                    <div key={index}>
                      <div
                        className={`${
                          selectedId === recipe.id && "bg-gray-200"
                        } p-2 rounded hover:cursor-pointer hover:bg-gray-300 `}
                        onClick={() => handleTitleClick(recipe.id)}
                      >
                        <span className=" uppercase">
                          {"->"}{" "}
                          {recipe.title && recipe.title.length > 30
                            ? recipe.title.slice(0, 30) + "..."
                            : recipe.title || "Untitled Recipe"}
                        </span>
                      </div>
                    </div>
                  );
                })
              : "no data found"}
          </div>
          <div className=" w-8/12 max-h-[80vh] overflow-y-auto outline rounded outline-1 outline-gray-200">
            {selectedId && (
              <RecipeDetail
                data={recipeData.filter((obj) => obj.id === selectedId)}
                handleDelete={handleDelete}
                handleEdit={handleEdit}
              />
            )}
          </div>
          {editId ? (
            <AddRecipeModal
              isOpen={isOpen}
              onClose={handleClose}
              onSave={handleSave}
              recipeData={recipeData}
              updateData={recipeData.filter((obj) => obj.id === editId)}
              setRecipeData={setRecipeData}
            />
          ) : (
            <AddRecipeModal
              isOpen={isOpen}
              onClose={handleClose}
              onSave={handleSave}
              recipeData={recipeData}
              setRecipeData={setRecipeData}
            />
          )}
        </div>
      ) : (
        <div className=" ">
          <div>
            <h2 className=" tracking-tighter font-bold text-4xl text-gray-800">
              Add Recipe
            </h2>
          </div>
          <div className="absolute bottom-20 right-20">
            <div
              onClick={handleAdd}
              className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer transition-all inline-block p-5 rounded-full text-white"
            >
              <AiOutlinePlus className=" font-bold text-3xl" />
            </div>
          </div>
          <AddRecipeModal
            isOpen={isOpen}
            onClose={handleClose}
            onSave={handleSave}
            recipeData={recipeData}
            setRecipeData={setRecipeData}
          />
        </div>
      )}
    </div>
  );
};

export default Home;
