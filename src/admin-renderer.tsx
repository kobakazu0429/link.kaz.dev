import { jsxRenderer } from "hono/jsx-renderer";

export const renderer = jsxRenderer(({ children }) => {
  return (
    <html lang="ja">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>admin | link.kaz.dev</title>
        <style>
          {`*,*:before,*:after {
            box-sizing: border-box;
          }`}
        </style>
      </head>
      <body style="font-family: 'Segoe UI', Meiryo, sans-serif; margin: 0; background-color: #f0f2f5; color: #1c1e21; display: flex; justify-content: center; align-items: flex-start; min-height: 100vh; padding: 20px;">
        <div style="display: flex; width: 100%; max-width: 1200px; background-color: #ffffff; box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1), 0 8px 16px rgba(0, 0, 0, 0.1); border-radius: 8px; overflow: hidden;">
          <div style="width: 40%; background-color: #ffffff; border-right: 1px solid #dddfe2; padding: 25px;">
            <h1 style="color: #1c1e21; margin-top: 0; margin-bottom: 20px; font-size: 24px; font-weight: 600;">
              短縮リンク作成
            </h1>
            <form method="post" action="/admin">
              <div style="margin-bottom: 18px;">
                <label
                  for="path"
                  style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #606770;"
                >
                  パス名:
                </label>
                <input
                  type="text"
                  id="path"
                  name="path"
                  required
                  style="width: 100%; padding: 10px; border: 1px solid #ccd0d5; border-radius: 6px; font-size: 15px; background-color: #f5f6f7;"
                />
              </div>
              <div style="margin-bottom: 18px;">
                <label
                  for="redirect"
                  style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #606770;"
                >
                  リダイレクト先URL:
                </label>
                <input
                  type="url"
                  id="redirect"
                  name="redirect"
                  required
                  placeholder="https://example.com"
                  style="width: 100%; padding: 10px; border: 1px solid #ccd0d5; border-radius: 6px; font-size: 15px; background-color: #f5f6f7;"
                />
              </div>
              <div style="margin-bottom: 18px;">
                <label
                  for="memo"
                  style="display: block; margin-bottom: 6px; font-weight: 600; font-size: 14px; color: #606770;"
                >
                  名称・メモ:
                </label>
                <textarea
                  id="memo"
                  name="memo"
                  placeholder=""
                  style="width: 100%; min-height: 100px; padding: 10px; border: 1px solid #ccd0d5; border-radius: 6px; font-size: 15px; resize: vertical; background-color: #f5f6f7;"
                ></textarea>
              </div>
              <button
                type="submit"
                style="background-color: #1877f2; color: white; padding: 12px 20px; border: none; border-radius: 6px; cursor: pointer; font-size: 16px; font-weight: 600; width: 100%; transition: background-color 0.2s ease;"
              >
                作成する
              </button>
            </form>
          </div>

          <div style="width: 60%; background-color: #f7f8fa; padding: 25px; overflow-y: auto; max-height: calc(100vh - 40px);">
            <h2 style="color: #1c1e21; margin-top: 0; margin-bottom: 20px; font-size: 20px; font-weight: 600;">
              作成済みリンクリスト
            </h2>

            {children}
          </div>
        </div>
      </body>
    </html>
  );
});
