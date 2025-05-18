import { Hono } from "hono";
import { admin } from "./admin";
import { KV_PREFIX_LINK } from "./constants";
import { V1Schema } from "./types";

const app = new Hono<{ Bindings: CloudflareBindings }>();

app.route("/admin", admin);

app.get("/:path", async (c) => {
  const path = c.req.param("path");
  const link = (await c.env.KV.get(KV_PREFIX_LINK + path, "json")) as V1Schema;
  console.log(link);
  if (!link) {
    c.status(404);
    return c.render("<h1>Not Found</h1>");
  }

  return c.redirect(link.redirect);
});

export default app;
