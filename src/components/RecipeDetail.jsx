import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const RecipeDetail = ({ data, handleDelete, handleEdit }) => {
  let { title, description, ingredients, image, id } = data[0];
  return (
    <div>
      <div className="  z-0 w-full bg-red-200">
        {image ? (
          <img
            className=" mb-4 bg-cover w-full h-[250px] aspect-square object-cover opacity-70 "
            src={image}
            alt={title}
          />
        ) : (
          ""
        )}
      </div>
      <div className={` px-2 pb-2 md:px-8 md:pb-4 ${!image && "mt-6"} `}>
        <div className=" border-b-[1px] mb-4 flex w-full justify-between items-center">
          <h3 className=" font-bold text-xl md:text-2xl uppercase tracking-tight mb-2 ">
            {title}
          </h3>
          <div className=" flex gap-4 items-center justify-center">
            <AiOutlineEdit
              onClick={() => {
                handleEdit(id);
              }}
              className=" text-2xl text-blue-700 hover:text-blue-900 hover:cursor-pointer"
            />
            <AiOutlineDelete
              onClick={() => {
                handleDelete(id);
              }}
              className=" text-2xl text-blue-700 hover:text-red-700 hover:cursor-pointer"
            />
          </div>
        </div>
        <div className=" mb-4">
          <h4 className=" font-semibold tracking-tight">Description</h4>
          <p className=" ml-4 text-justify">{description}</p>
        </div>
        <div>
          <h4 className=" font-semibold tracking-tight">Ingredients</h4>
          <ul className="ml-8 list-decimal" >
            {ingredients?.map((element, index) => {
              return <li key={index}>{element}</li>;
            })}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
