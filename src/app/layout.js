export const metadata = {
  title: '3D 遊戲設計工坊',
  description: '上傳圖片、描述遊戲、選擇模板，一鍵產出部署設定',
}

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body style={{ margin: 0, padding: 0, background: '#060612' }}>
        {children}
      </body>
    </html>
  )
}
