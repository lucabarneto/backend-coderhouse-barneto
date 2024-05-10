const express = require("express"),
  CustomError = require("../services/errors/custom_error.js"),
  infoError = require("../services/errors/info_error.js"),
  EErrors = require("../services/errors/enum_error.js");

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

  handlePolicies(policies = []) {
    if (!(policies instanceof Array) || policies.length === 0) {
      CustomError.createCustomError({
        name: "Incorrect policies error",
        cause: infoError.incorrectPolicyErrorInfo(policies),
        message: "There was an error in the given policies for the endpoint",
        code: EErrors.INVALID_PARAM_ERROR,
      });
    }

    for (const policy of policies) {
      if (
        typeof policy !== "string" ||
        policy.match(/^[A-Z]+$/) === null ||
        (policy !== "PUBLIC" && policy !== "USER" && policy !== "ADMIN")
      ) {
        CustomError.createCustomError({
          name: "Incorrect policies error",
          cause: infoError.incorrectPolicyErrorInfo(policies),
          message: "There was an error in the given policies for the endpoint",
          code: EErrors.INVALID_PARAM_ERROR,
        });
      }
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
        return { status: false, error: err };
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
