import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { ChakraProvider } from "@chakra-ui/react";
import Chatprovider from "./contextprovider/Chatprovider";
ReactDOM.render(
  <ChakraProvider>
    <BrowserRouter>
      <Chatprovider>
        <App />
      </Chatprovider>
    </BrowserRouter>
  </ChakraProvider>,
  document.getElementById("root")
);
