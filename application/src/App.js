import "./App.css";
import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link, useParams } from "react-router-dom";
const allCategories = gql`
  query Category {
    allCategories {
      id
      name
      description
    }
  }
`;
const getCategory = gql`
  query Category($categoryId: ID!) {
    Category(id: $categoryId) {
      id
      name
      description
      Products {
        id
        name
      }
    }
  }
`;
const ADD_PRODUCT = gql`
mutation CreateProduct($stock: Int!, $price: Float!, $description: String!, $color: String!, $categoryId: ID!, $name: String!) {
  createProduct(stock: $stock, price: $price, description: $description, color: $color, category_id: $categoryId, name: $name) {
    
  }
}
`;
function Categories() {
  const { loading, error, data } = useQuery(allCategories);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return data.allCategories.map((category) => (
    <div>
      <dt>
        <Link to={category.id}>{category.name}</Link>
      </dt>
      <dd>-{category.description}</dd>
    </div>
  ));
}

function Category() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(getCategory, {
    variables: { categoryId: id },
  });
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <div>
      <h1>{data.Category.name}</h1>
      <p>{data.Category.description}</p>
      <ul>
        {data.Category.Products.map((product) => (
          <li>
            <Link to={product.id}>{product.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
function Product() {
  const { id } = useParams();
  console.log(id);
}
function addProduct() {
  const [addTodo, { data, loading, error }] = useMutation(ADD_PRODUCT);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
}
function NewProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
      }}
    >
      <label>
        Product Name:
        <input
          value={name}
          placeholder="String"
          onChange={(e) => setName(e.target.value)}
        />
      </label>
      <label>
        Product Description:
        <input
          value={description}
          placeholder="String"
          onChange={(e) => setDescription(e.target.value)}
        />
      </label>
      <label>
        Product Color:
        <input
          value={color}
          placeholder="String"
          onChange={(e) => setColor(e.target.value)}
        />
      </label>
      <label>
        Product Stock:
        <input
          value={stock}
          placeholder="Integer"
          onChange={(e) => setStock(e.target.value)}
        />
      </label>
      <label>
        Product Price:
        <input
          value={price}
          placeholder="Float"
          onChange={(e) => setPrice(e.target.value)}
        />
      </label>
      <input type="submit" value="Submit" />
    </form>
  );
}
function ProductPage() {
  return (
    <div className="Product">
      <Link to="/">Go home</Link>
      <Product />
    </div>
  );
}
function CategoriesPage() {
  return (
    <div className="Product">
      <Link to="/">Go back</Link>
      <h1> Add a New Product</h1>
      <NewProductForm />
      <Category />
    </div>
  );
}
function Homepage() {
  return (
    <div className="App">
      <h1>Cyral Depot</h1>
      <dl>
        <Categories />
      </dl>
    </div>
  );
}

export { Homepage, CategoriesPage, ProductPage };
