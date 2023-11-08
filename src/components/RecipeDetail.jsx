const RecipeDetail = ({ data }) => {
    const { title, description, ingredients, image } = data[0];
    return <div>
        <h3>{title}</h3>
        <p>{description}</p>
        <p>{ingredients}</p>
    </div>;
};

export default RecipeDetail;
