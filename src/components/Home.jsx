import { useState, useEffect } from "react";
import AddRecipeModal from "./AddRecipeModal";
import RecipeDetail from "./RecipeDetail";
import { AiOutlinePlus } from "react-icons/ai";
import { toast } from "react-toastify";

const DB_NAME = "recipe-note";

// firebase import
import { db } from "../firebase";
import {
  collection,
  addDoc,
  getDocs,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeData, setRecipeData] = useState([]);

  const [selectedId, setSelectedId] = useState(null);

  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setEditId(null);
    // setSelectedId(null);
    setIsOpen(false);
  };

  // firebase add
  const addRecipe = async (recipe) => {
    try {
      const docRef = await addDoc(collection(db, DB_NAME), recipe);
      return docRef.id;
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  // firebase read
  const fetchData = async () => {
    // await getDocs(collection(db, DB_NAME)).then((querySnapshot) => {
    //   const newData = querySnapshot.docs.map((doc) => ({
    //     ...doc.data().recipe,
    //     id: doc.id,
    //   }));

    //   setRecipeData(newData);
    // });

    const querySnapshot = await getDocs(collection(db, DB_NAME));
    const newData = [];
    querySnapshot.forEach((doc) => {
      const dbData = { id: doc.id, ...doc.data().recipe };
      newData.push(dbData);
    });
    setRecipeData(newData);
  };

  // firebase delete
  const deleteData = async (id) => {
    await deleteDoc(doc(db, DB_NAME, id));
  };

  // edit data
  const editData = async (recipe) => {
    await updateDoc(doc(db, DB_NAME, recipe.id), { recipe });
  };

  const handleSave = async (recipe) => {
    let existingRecipe;
    if (recipeData.length > 0) {
      existingRecipe = recipeData.find((r) => r.id === recipe.id);
    }
    if (existingRecipe) {
      // console.log("old need to update");
      const updateData = recipeData.map((r) =>
        r.id === recipe.id ? { ...r, ...recipe } : r
      );
      editData(recipe);
      setRecipeData(updateData);
    } else {
      // console.log("new data");
      const newData = { ...recipeData, recipe };
      const id = await addRecipe(newData);
      setRecipeData([...recipeData, { ...recipe, id: id }]);
    }
  };

  const handleDelete = (id) => {
    const confirm = window.confirm(
      "Are you sure you want to delete the recipe"
    );
    if (confirm) {
      if (deleteData(id)) {
        const updatedRecipeData = recipeData.filter((data) => data.id !== id);
        setRecipeData(updatedRecipeData);
        setSelectedId(null);
        toast.success("Recipe deleted successfully");
      }
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
    fetchData();
  }, []);

  const handleTitleClick = (id) => {
    setSelectedId(id);
  };

  return (
    <div className="relative min-h-screen w-full grid place-items-center">
      {recipeData.length > 0 ? (
        <div className=" flex gap-8 w-10/12 min-h-[90vh] ">
          <div className=" border-b-2 max-h-[90vh] overflow-x-auto w-4/12 px-8 py-4 min-h-full outline rounded outline-1 outline-gray-200">
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
          <div className=" w-8/12 max-h-[90vh] overflow-y-auto outline rounded outline-1 outline-gray-200">
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
