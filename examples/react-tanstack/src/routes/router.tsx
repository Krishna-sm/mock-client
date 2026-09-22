import { createBrowserRouter, Navigate } from "react-router-dom";
import { Layout } from "../components/Layout";
import { QueryPage } from "../features/query/pages/QueryPage";
import { MutationPage } from "../features/mutation/pages/MutationPage";
import { InfinitePage } from "../features/infinite-scroll/pages/InfinitePage";
import { TablePage } from "../features/table/pages/TablePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <Navigate to="/query" replace />,
      },
      {
        path: "query",
        element: <QueryPage />,
      },
      {
        path: "mutation",
        element: <MutationPage />,
      },
      {
        path: "infinite-scroll",
        element: <InfinitePage />,
      },
      {
        path: "table",
        element: <TablePage />,
      },
    ],
  },
]);
