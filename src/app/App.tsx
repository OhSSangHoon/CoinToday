import { RouterProvider, createBrowserRouter } from "react-router-dom";
import { Layout1 } from "../layouts/index";
import { ExchangePage, LoginPage, MainPage, TestPage, NewsPage, Mypage } from "./index";
import "./index.css";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout1 />,
    children: [
      { path: "test", element: <TestPage /> },
      { path: "/", element: <MainPage /> },
      { path: "news", element: <NewsPage /> },
      { path: "login", element: <LoginPage /> },
      { path: "exchange", element: <ExchangePage /> },
      { path: "exchange/:coinCode", element: <ExchangePage /> },
    ],
  },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
