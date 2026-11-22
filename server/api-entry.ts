import { createServer } from "./index";

const app = createServer();

export default function handler(req: any, res: any) {
  return app(req, res);
}
