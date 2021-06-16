// const express = require("express");
// const React = require("react");
// const renderToString = require("react-dom/server").renderToString;
// const Home = require("./client/components/home").default;
import "babel-polyfill";
import express from "express";
import proxy from "express-http-proxy";
import dotenv from "dotenv";
import { matchRoutes } from "react-router-config";
import Routes from "./client/Routes";
import renderer from "./helpers/renderer";
import createStore from "./helpers/createStore";

const app = express();

app.use(
  "/api",
  proxy("http://react-ssr-api.herokuapp.com", {
    // cái object option thì chỉ dành cho project này thôi, là do cách setup bên server api quy định để thêm flexible và security rules thôi
    proxyReqOptDecorator(opts) {
      opts.headers["x-forwarded-host"] = "localhost:3000";
      return opts;
    },
  })
);
dotenv.config();
app.use(express.static("public"));
app.get("*", (req, res) => {
  const store = createStore(req);

  console.log(process.env.NODE_ENV);
  // Some logic to initialize and load data into the store
  // console.log(matchRoutes(Routes, req.path));
  const promises = matchRoutes(Routes, req.path)
    .map(({ route }) => {
      return route.loadData ? route.loadData(store) : null;
    })
    .map((promise) => {
      if (promise) {
        return new Promise((resolve, reject) => {
          promise.then(resolve).catch(resolve);
        });
      }
    });

  Promise.all(promises).then(() => {
    const context = {};
    const content = renderer(req, store, context);

    console.log(context);
    if (context.url) {
      return res.redirect(301, context.url);
    }
    if (context.notFound) {
      res.status(404);
    }

    res.send(content);
  });
});

app.listen(3000, () => {
  console.log("Listening on port 3000");
});
