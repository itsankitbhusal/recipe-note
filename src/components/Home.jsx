import { useState } from "react"
import AddRecipeModal from "./AddRecipeModal"
import { AiOutlinePlus } from "react-icons/ai"
import data from "../data/data"
import { useEffect } from "react"

const Home = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [recipeData, setRecipeData] = useState([]);

  useEffect(() => {
    setRecipeData(data);
    console.log(data)
  },[])
  useEffect(() => {
    console.log("recepie data: ", recipeData)
  },[recipeData])

  const handleAdd = () => {
    setIsOpen(true);
    console.log(data)
  }
  const handleClose = () => {
    setIsOpen(false);
    console.log("recipe data", recipeData)
  }
  const handleSave = (recipe) => {
    setRecipeData([...recipeData, recipe]);
  }
  return (
    <div className="relative min-h-screen w-full grid place-items-center">
      <div>
        {recipeData ? recipeData.map((recipe, index) => {
          const { id, title, ingredients, description, image } = recipe
          console.log("map", recipe)
          return(<div key={index}>
            <li>{recipe.title}</li> 
          </div>)
        }): "no data found"}
      </div>
      <div className=" bg-red-100">
        <div className="absolute bottom-20 right-20">
      <div onClick={handleAdd} className="bg-blue-400 hover:bg-blue-500 hover:cursor-pointer transition-all inline-block p-5 rounded-full text-white">
      <AiOutlinePlus className=" font-bold text-3xl" />
      </div>
        </div>
      <AddRecipeModal isOpen={isOpen} onClose={handleClose} onSave={handleSave} recipeData={recipeData} setRecipeData={setRecipeData} />
      </div>
    </div>
  )
}

export default Home