const express = require("express");

class Router {
  constructor() {
    this.router = express.Router();
    this.init();
  }

  init() {}

  get getRouter() {
    return this.router;
  }

  applyCallbacks(callbacks) {
    return callbacks.map((cb) => async (...params) => {
      try {
        await cb.apply(this, params);
      } catch (error) {
        console.error(error);
        params[1].sendServerError(error);
      }
    });
  }

  generateCustomRespones(req, res, next) {
    res.sendSuccess = (payload) =>
      res.status(200).send({ status: "success", status_code: 200, payload });

    res.sendCreatedSuccess = (payload) =>
      res.status(201).send({ status: "success", status_code: 201, payload });

    res.sendRedirect = (url) => res.status(301).redirect(url);

    res.sendUserError = (error) =>
      res.status(400).send({ status: "error", status_code: 400, error });

    res.sendUnhandledError = () =>
      res
        .status(400)
        .send({ status: "error", status_code: 400, error: "Unhandled Error" });

    res.sendAuthenticationError = (error) =>
      res.status(401).send({ status: "error", status_code: 401, error });

    res.sendAuthorizationError = (error) =>
      res.status(403).send({ status: "error", status_code: 403, error });

    res.sendNotFoundError = (error) =>
      res.status(404).send({ status: "error", status_code: 404, error });

    res.sendServerError = (error) =>
      res.status(500).send({ status: "error", status_code: 500, error });

    next();
  }

  handlePolicies(policies = undefined) {
    if (policies === undefined)
      return console.error("No policy array provided");
    if (!(policies instanceof Array))
      return console.error("Policies must be inside an array");
    if (policies.length === 0)
      return console.error("No policy provided inside the array");

    for (const policy of policies) {
      if (typeof policy !== "string")
        return console.error(`Policy '${policy} must be a string'`);
      if (policy.match(/^[A-Z]+$/) === null)
        return console.error(
          `Policy '${policy} must be written in upper case'`
        );
      if (policy !== "PUBLIC" && policy !== "USER" && policy !== "ADMIN")
        return console.error("Incorrect policy: " + policy);
    }

    return (req, res, next) => {
      try {
        let policy = [];

        if (policies.includes("USER")) policy.push("user");

        if (policies.includes("ADMIN")) policy.push("admin");

        if (policies.includes("PUBLIC")) policy.push("public");

        req.policy = policy;
        next();
      } catch (err) {
        console.error("An error has occurred: ", err);
      }
    };
  }

  get(path, policies, ...callbacks) {
    this.router.get(
      path,
      this.generateCustomRespones,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  post(path, policies, ...callbacks) {
    this.router.post(
      path,
      this.generateCustomRespones,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  put(path, policies, ...callbacks) {
    this.router.put(
      path,
      this.generateCustomRespones,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }

  delete(path, policies, ...callbacks) {
    this.router.delete(
      path,
      this.generateCustomRespones,
      this.handlePolicies(policies),
      this.applyCallbacks(callbacks)
    );
  }
}

module.exports = Router;
