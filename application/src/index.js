import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { Homepage, CategoriesPage, ProductPage } from "./App";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const client = new ApolloClient({
  uri: "https://mock-graphql-endpoint-interview.onrender.com/graphql",
  cache: new InMemoryCache(),
});

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ApolloProvider client={client}>
    <Router>
      <Routes>
        <Route exact path="/" element={<Homepage />} />
        <Route exact path="/:id" element={<CategoriesPage />} />
        <Route exact path="/:id/:id" element={<ProductPage />} />
      </Routes>
    </Router>
  </ApolloProvider>
);
