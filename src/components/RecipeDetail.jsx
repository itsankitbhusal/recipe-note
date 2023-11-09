const RecipeDetail = ({ data }) => {
    const { title, description, ingredients, image } = data[0];
  return (
    <>
      {image ? (
        <img
          className=" mb-4 bg-cover w-full h-[250px] aspect-square object-cover opacity-70 "
          src={image}
          alt={title}
        />
      ) : (
        ""
      )}
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
    </>
  );
};

export default RecipeDetail;
