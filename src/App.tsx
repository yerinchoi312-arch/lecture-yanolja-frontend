import {  RouterProvider } from "react-router";
import { router } from "./router/router.tsx";
import "../src/style/index.css"

function App() {

  return (
      <RouterProvider router={router} />
  )
}

export default App
