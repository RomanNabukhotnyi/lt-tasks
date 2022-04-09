import {Router} from "express";
import {controller} from "./controller"
export const createRouter = () => {
   const router = Router();
   router.post("/:route", controller.post);
   router.get("/:route", controller.get);
   return router;
}

