import { AiOutlineEdit, AiOutlineDelete } from "react-icons/ai";

const RecipeDetail = ({ data, handleDelete, handleEdit }) => {
  let { title, description, ingredients, image, id } = data[0] ;
  return (
    <div>
      <div className=" relative z-0 h-[300px] w-full">
        <div className=" absolute z-10 inline-block right-0 p-2 rounded">
          <div className=" flex gap-4">
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
        {image ? (
          <img
            className=" absolute mb-4 bg-cover w-full h-[250px] aspect-square object-cover opacity-70 "
            src={image}
            alt={title}
          />
        ) : (
          ""
        )}
      </div>
      <div className="  px-8 py-4">
        <div className=" border-b-[1px] mb-4">
          <h3 className=" font-bold text-2xl uppercase tracking-tight mb-2 ">
            {title}
          </h3>
        </div>
        <div className=" mb-4">
          <h4 className=" font-semibold tracking-tight">Description</h4>
          <p className=" ml-4 text-justify">{description}</p>
        </div>
        <div>
          <h4 className=" font-semibold tracking-tight">Ingredients</h4>
          <ol className="ml-4">
            {ingredients?.map((element, index) => {
              return <li key={index}>{element}</li>;
            })}
          </ol>
        </div>
      </div>
    </div>
  );
};

export default RecipeDetail;
