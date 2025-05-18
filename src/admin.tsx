import { Hono } from "hono";
import { basicAuth } from "hono/basic-auth";
import { renderer } from "./admin-renderer";
import { KV_PREFIX_LINK } from "./constants";
import { V1Schema } from "./types";

export const admin = new Hono<{ Bindings: CloudflareBindings }>();

admin.use(renderer);

admin.use(
  "*",
  basicAuth({
    verifyUser: async (username, password, c) => {
      console.log(username, password);

      const env = c.env as CloudflareBindings;

      return (
        username === (await env.LINK_KAZ_DEV_ADMIN_USER.get()) &&
        password === (await env.LINK_KAZ_DEV_ADMIN_PASSWORD.get())
      );
    },
  })
);

const LinkComponent = ({
  createdAt,
  path,
  redirect,
  memo,
}: {
  createdAt: number;
  path: string;
  redirect: string;
  memo: string;
}) => {
  const link = `https://link.kaz.dev/${encodeURIComponent(path)}`;
  return (
    <div style="background-color: #ffffff; border: 1px solid #dddfe2; border-radius: 8px; padding: 18px; margin-bottom: 15px; box-shadow: 0 1px 2px rgba(0,0,0,0.05);">
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <div style="font-size: 12px; color: #606770; margin-bottom: 4px;">
            作成日時: {new Date(createdAt).toISOString()}
          </div>
          <a
            href={link}
            target="_blank"
            style="font-size: 16px; font-weight: 600; color: #0a66c2; text-decoration: none; word-break: break-all;"
          >
            /{path}
          </a>
        </div>
      </div>
      <div style="margin-bottom: 10px;">
        <strong style="font-size: 13px; color: #333;">リダイレクト先:</strong>
        <a
          href={redirect}
          rel="noreferrer"
          target="_blank"
          style="font-size: 14px; color: #0a66c2; text-decoration: none; word-break: break-all; margin-left: 5px;"
        >
          {redirect}
        </a>
      </div>
      <div style="margin-bottom: 12px;">
        <strong style="font-size: 13px; color: #333;">名称・メモ:</strong>
        <p style="font-size: 14px; color: #3c4043; white-space: pre-wrap; margin-top: 4px; margin-bottom: 0; background-color: #f0f2f5; padding: 8px; border-radius: 4px;">
          {memo}
        </p>
      </div>
      <div style="display: flex; justify-content: flex-end; align-items: center; gap: 10px;">
        <button
          type="button"
          id={`copy-${path}`}
          data-value={link}
          style="background-color: #42b72a; color: white; padding: 6px 12px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500;"
        >
          コピー
        </button>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              document.getElementById("copy-${path}").addEventListener("click", (e) => {
                navigator.clipboard.writeText(e.target.dataset.value);
              });
            `,
          }}
        />
        <form
          action={`/admin/delete/${encodeURIComponent(path)}`}
          method="post"
        >
          <button
            type="submit"
            style="background-color: #fa383e; color: white; padding: 6px 10px; border: none; border-radius: 6px; cursor: pointer; font-size: 13px; font-weight: 500; white-space: nowrap;"
          >
            削除
          </button>
        </form>
      </div>
    </div>
  );
};

admin.get("/", async (c) => {
  const linkKeys = await c.env.KV.list({ prefix: KV_PREFIX_LINK });
  if (linkKeys.keys.length > 0) {
    const links = [
      ...(
        await c.env.KV.get(
          linkKeys.keys.map(({ name }) => name),
          "json"
        )
      ).values(),
    ] as any as V1Schema[];

    return c.render(
      <>
        {links.map((link) => (
          <LinkComponent
            path={link.path}
            redirect={link.redirect}
            memo={link.memo}
            createdAt={1747561049472}
          />
        ))}
      </>
    );
  }
  return c.render(
    <div style="text-align: center; padding: 40px 20px; background-color: #ffffff; border: 1px dashed #dddfe2; border-radius: 8px;">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="#adb5bd"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
        style="margin-bottom: 15px;"
      >
        <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"></path>
        <line x1="12" y1="9" x2="12" y2="13"></line>
        <line x1="12" y1="17" x2="12.01" y2="17"></line>
      </svg>
      <p style="font-size: 16px; color: #606770; margin-top: 0; margin-bottom: 8px;">
        作成された短縮リンクはありません。
      </p>
      <p style="font-size: 14px; color: #8a9096;">
        左のフォームから新しい短縮リンクを作成できます。
      </p>
    </div>
  );
});

admin.post("/", async (c) => {
  const formdata = await c.req.formData();
  const path = formdata.get("path") as string | null;
  const redirect = formdata.get("redirect") as string | null;
  const memo = formdata.get("memo") as string | null;
  if (!path || !redirect || path === "" || redirect === "") {
    c.status(500);
    return c.text(`Wrong :C\npath: ${path}\nredirect: ${redirect}`);
  }

  const data: V1Schema = {
    version: "v1",
    path,
    redirect,
    memo: memo ?? "",
    createdAt: Date.now(),
  };

  await c.env.KV.put(KV_PREFIX_LINK + path, JSON.stringify(data));

  return c.redirect("/admin");
});

admin.post("/delete/:path", async (c) => {
  const path = c.req.param("path");
  await c.env.KV.delete(KV_PREFIX_LINK + path);
  return c.redirect("/admin");
});
