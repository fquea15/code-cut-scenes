import { Request, Response, Router } from "express";

const indexRoutes = Router();

indexRoutes.get("/", (req: Request, res: Response) => {
  res.status(200).json({ message: "Hello World" });
});

export default indexRoutes;
