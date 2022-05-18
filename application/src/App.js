import "./App.css";
import { useState } from "react";
import { useQuery, gql, useMutation } from "@apollo/client";
import { Link, useParams, useNavigate } from "react-router-dom";
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
  mutation CreateProduct(
    $name: String!
    $description: String!
    $color: String!
    $stock: Int!
    $price: Float!
    $categoryId: ID!
  ) {
    createProduct(
      name: $name
      description: $description
      color: $color
      stock: $stock
      price: $price
      category_id: $categoryId
    ) {
      name
    }
  }
`;

const GET_PRODUCT = gql`
  query Product($productId: ID!) {
    Product(id: $productId) {
      name
      description
      color
      stock
      price
      category_id
    }
  }
`;
const UPDATE_STOCK = gql`
  mutation Mutation($updateProductId: ID!, $stock: Int) {
    updateProduct(id: $updateProductId, stock: $stock) {
      name
      stock
    }
  }
`;
const DELETE_PRODUCT = gql`
  mutation Mutation($removeProductId: ID!) {
    removeProduct(id: $removeProductId) {
      name
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
function ProductDetail() {
  const { id } = useParams();

  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { productId: id },
  });

  const [changeStock] = useMutation(UPDATE_STOCK);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <div>
      <h1>{data.Product.name}</h1>
      <p>Description: {data.Product.description}</p>
      <p>Color: {data.Product.color}</p>
      <p>
        Stock: {data.Product.stock}
        <button
          className="button-1"
          onClick={(e) => {
            e.preventDefault();
            changeStock({
              variables: {
                updateProductId: id,
                stock: data.Product.stock + 1,
              },
            });
            setTimeout(() => {}, 10000);
            window.location.reload();
          }}
        >
          +
        </button>
        <button
          className="button-1"
          onClick={(e) => {
            e.preventDefault();
            changeStock({
              variables: {
                updateProductId: id,
                stock: data.Product.stock - 1,
              },
            });
            setTimeout(() => {}, 10000);
            window.location.reload();
          }}
        >
          -
        </button>
      </p>
      <p>Price: {data.Product.price}</p>
    </div>
  );
}
function DeleteProduct() {
  const { id } = useParams();
  const { loading, error, data } = useQuery(GET_PRODUCT, {
    variables: { productId: id },
  });
  const [deleteProduct] = useMutation(DELETE_PRODUCT);
  let navigate = useNavigate();
  const routeChange = () => {
    let path = `/${data.Product.category_id}`;
    navigate(path);
  };
  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error</p>;
  return (
    <button
      className="button-2"
      onClick={(e) => {
        if (window.confirm("Are you sure you wish to delete this item?")) {
          e.preventDefault();
          deleteProduct({
            variables: { removeProductId: id },
          });
          routeChange();
          window.location.reload();
        }
      }}
    >
      Delete Product
    </button>
  );
}
function NewProductForm() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState("");
  const [stock, setStock] = useState("");
  const [price, setPrice] = useState("");
  const { id } = useParams();
  const [addProduct, { data, loading, error }] = useMutation(ADD_PRODUCT);
  if (loading) return "Submitting...";
  if (error) return `Submission error! ${error.message}`;
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        addProduct({
          variables: {
            name: name,
            description: description,
            color: color,
            stock: parseInt(stock),
            price: parseFloat(price),
            categoryId: id,
          },
        });
        setName("");
        setDescription("");
        setColor("");
        setStock("");
        setPrice("");
      }}
    >
      <label>
        Product Name:
        <input
          className="textarea"
          value={name}
          placeholder="Name of product"
          onChange={(e) => setName(e.target.value)}
          required
        />
      </label>
      <label>
        Product Description:
        <input
          className="textarea"
          value={description}
          placeholder="Description of product"
          onChange={(e) => setDescription(e.target.value)}
          required
        />
      </label>
      <label>
        Product Color:
        <input
          className="textarea"
          value={color}
          placeholder="Color of product"
          onChange={(e) => setColor(e.target.value)}
          required
        />
      </label>
      <label>
        Product Stock:
        <input
          className="textarea"
          value={stock}
          placeholder="Please enter a number"
          onChange={(e) => {
            const re = /^[0-9\b]+$/;
            if (e.target.value === "" || re.test(e.target.value)) {
              setStock(e.target.value);
            }
          }}
          required
        />
      </label>
      <label>
        Product Price:
        <input
          className="textarea"
          value={price}
          placeholder="Please enter a decimal number"
          onChange={(e) => {
            const re = /[+-]?\d+(?:[.,]\d+)?/;
            if (e.target.value === "" || re.test(e.target.value)) {
              setPrice(e.target.value);
            }
          }}
          required
        />
      </label>
      <input className="button-1" type="submit" value="Submit" />
    </form>
  );
}
function ProductPage() {
  return (
    <div className="Product">
      <Link to="/">Go home</Link>
      <ProductDetail />
      <DeleteProduct />
    </div>
  );
}
function CategoriesPage() {
  return (
    <div className="Product">
      <Link to="/">Go back</Link>
      <Category />
      <h1> Add a New Product</h1>
      <NewProductForm />
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
