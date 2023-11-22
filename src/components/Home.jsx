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

import { storage } from "../firebase";
import {
  ref,
  getDownloadURL,
  uploadBytesResumable,
  deleteObject,
} from "firebase/storage";

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeData, setRecipeData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedId, setSelectedId] = useState(null);
  const [editId, setEditId] = useState(null);

  const handleAdd = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    setEditId(null);
    setIsOpen(false);
  };

  const getUniqueName = (filename) => {
    const cleanFilename = filename.replace(/[^a-zA-Z0-9]/g, "");
    const date = Date.now();
    return `${cleanFilename}${date}`;
  };

  // firebase add
  const addRecipe = async (recipe) => {
    try {
      if (recipe.fileList) {
        const fileList = recipe.imageFile[0];
        const storageRef = ref(storage, getUniqueName(fileList.name));

        const uploadTaskSnapshot = await uploadBytesResumable(
          storageRef,
          fileList
        );

        // Wait for the upload to complete
        await getDownloadURL(uploadTaskSnapshot.ref);

        // Once the upload is complete, proceed with adding the rest of the data
        const downloadUrl = await getDownloadURL(uploadTaskSnapshot.ref);
        let id;
        if (downloadUrl) {
          id = await addRestData(recipe, downloadUrl);
        }
        return { id, downloadUrl };
      } else {
        const id = await addRestData(recipe, recipe.image);
        const url = recipe.image;
        return { id, downloadUrl: url };
      }
    } catch (error) {
      toast.error(error);
    }
  };

  // function after the imageUrl
  const addRestData = async (recipe, imageUrl) => {
    try {
      const { imageFile, ...newData } = recipe;
      const updatedData = {
        ...newData,
        image: imageUrl ? imageUrl : newData.image,
      };

      const docRef = await addDoc(collection(db, DB_NAME), updatedData);
      return docRef.id;
    } catch (error) {
      toast.error(error);
      return null; // Return null in case of an error
    }
  };

  // firebase read
  const fetchData = async () => {
    try {
      setIsLoading(true);
      const querySnapshot = await getDocs(collection(db, DB_NAME));
      const newData = [];
      querySnapshot.forEach((doc) => {
        const dbData = { id: doc.id, ...doc.data() };
        newData.push(dbData);
      });
      setRecipeData(newData);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      toast.error(error);
    }
  };

  // firebase delete
  const deleteData = async (id, image) => {
    try {
      const imageRef = ref(storage, image);
      await deleteDoc(doc(db, DB_NAME, id));
      await deleteObject(imageRef);
    } catch (error) {
      console.error(error);
      toast.error(error);
    }
  };

  // edit data
  const editData = async (recipe) => {
    const sanitizedRecipe = {
      ...recipe,
      image: recipe.image ? recipe.image : "",
    };
    const docRef = doc(db, DB_NAME, sanitizedRecipe.id);
    try {
      await updateDoc(docRef, sanitizedRecipe);
      toast.success("Recipe updated successfully!!");
    } catch (error) {
      console.error("Error updating document:", error);
      toast.error(error);
    }
  };

  const uploadImage = async (file) => {
    // upload image to firebase
    if (file) {
      const storageRef = ref(storage, getUniqueName(file.name));

      const uploadTaskSnapshot = await uploadBytesResumable(storageRef, file);

      // Wait for the upload to complete
      await getDownloadURL(uploadTaskSnapshot.ref);

      // Once the upload is complete, proceed with adding the rest of the data
      const downloadUrl = await getDownloadURL(uploadTaskSnapshot.ref);
      return downloadUrl;
    }
  };

  const handleSave = async (recipe) => {
    let existingRecipe;
    if (recipeData.length > 0) {
      existingRecipe = recipeData.find((r) => r.id === recipe.id);
      if (existingRecipe) {
        if (recipe?.imageFile) {
          const newUrl = await uploadImage(recipe.imageFile[0]);
          const newData = { ...recipe, image: newUrl ? newUrl : recipe.image };
          const { imageFile, ...restData } = newData;

          const updateData = recipeData.map((r) =>
            r.id === restData.id ? { ...r, ...restData } : r
          );
          editData(restData);
          setRecipeData(updateData);
          return;
        } else {
          const updateData = recipeData.map((r) =>
            r.id === recipe.id ? { ...r, ...recipe } : r
          );
          editData(recipe);
          setRecipeData(updateData);
          return;
        }
      }
    }
    const { id, downloadUrl } = await addRecipe(recipe);
    if (id) {
      const { imageFile, ...newData } = recipe;

      setRecipeData([
        ...recipeData,
        { ...newData, id: id, image: downloadUrl },
      ]);
      toast.success("Recipe added successfully!!");
    }
  };

  const handleDelete = (id, image) => {
    const confirm = window.confirm(
      "Are you sure you want to delete the recipe"
    );
    if (confirm) {
      if (deleteData(id, image)) {
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

  if (isLoading) {
    return (
      <div className=" min-h-screen w-full grid place-items-center text-4xl tracking-tighter font-bold">
        Loading...
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full grid place-items-center">
      {recipeData.length > 0 ? (
        <div className=" flex items-center lg:items-stretch flex-col lg:flex-row w-full gap-0 sm:gap-4 lg:gap-8 lg:w-10/12 min-h-[90vh] ">
          <div className=" border-b-2 mt-0 sm:mt-8 lg:mt-0 max-h-[90vh] overflow-x-auto w-full sm:w-11/12 md:w-10/12 lg:w-4/12 px-2 py-2 md:px-8 md:py-4 min-h-full sm:outline sm:rounded sm:outline-1 outline-gray-200">
            <div className=" border-b-[1px] mb-2">
              <div className=" mb-2 font-semibold tracking-tighter text-xl flex  justify-between items-center ">
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
                        } p-0 sm:p-2 rounded hover:cursor-pointer hover:bg-gray-300 `}
                        onClick={() => handleTitleClick(recipe.id)}
                      >
                        <span className=" uppercase text-xs sm:text-sm md:text-base">
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
          <div className=" w-full sm:w-11/12 md:w-10/12 lg:w-8/12 max-h-[90vh] overflow-y-auto sm:outline sm:rounded sm:outline-1 outline-gray-200">
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
              edit={true}
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
