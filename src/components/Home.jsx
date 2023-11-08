import { useState, useEffect } from "react";
import AddRecipeModal from "./AddRecipeModal";
import RecipeDetail from "./RecipeDetail";
import { AiOutlinePlus, AiOutlineDelete } from "react-icons/ai";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeData, setRecipeData] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const handleAdd = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setIsOpen(false);
  };

  const handleSave = (recipe) => {
    const dataToSet = [...recipeData, recipe];
    setRecipeData(dataToSet);
    localStorage.setItem("recipe", JSON.stringify(dataToSet));
  };

  const handleDelete = (id) => {
    const updatedRecipeData = recipeData.filter((data) => data.id !== id);
    setRecipeData(updatedRecipeData)
    localStorage.setItem("recipe", JSON.stringify(updatedRecipeData));
  };

  useEffect(() => {
    const data = JSON.parse(localStorage.getItem("recipe"));
    if (data) {
      setRecipeData(data);
    }
  }, []);

  const handleTitleClick = (id) => {
    console.log(`id: ${id} is clicked`);
    setSelectedId(id);
  };

  return (
    <div className="relative min-h-screen w-full grid place-items-center">
      <div className=" flex gap-8 bg-red-100 w-10/12 min-h-[80vh] mt-12">
        <div className=" bg-gray-200 w-4/12 px-8 py-4 min-h-full">
          {recipeData
            ? recipeData.map((recipe, index) => {
                return (
                  <div key={index}>
                    <div
                      className=" p-2 rounded hover:cursor-pointer hover:bg-gray-300 "
                      onClick={() => handleTitleClick(recipe.id)}
                    >
                      <span className=" flex justify-between">
                        <span>
                          {"->"} {recipe.title}
                        </span>
                        <span
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDelete(recipe.id);
                          }}
                          className=" hover:text-red-700"
                        >
                          <AiOutlineDelete />
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })
            : "no data found"}
        </div>
        <div className=" w-8/12 px-8 py-4">
          {selectedId ? (
            <>
              <RecipeDetail
                data={recipeData.filter((obj) => obj.id === selectedId)}
              />
            </>
          ) : (
            ""
          )}
        </div>
      </div>
      <div className=" bg-red-100">
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
    </div>
  );
};

export default Home;
