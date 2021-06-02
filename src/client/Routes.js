import React from "react";
import HomePage from "./pages/HomePage";
import UsersListPage from "./pages/UsersListPage";

// export default () => {
//   return (
//     <div>
//       <Route exact path="/" component={HomePage} />
//       <Route exact path="/users" component={UsersListPage} />
//     </div>
//   );
// };

export default [
  {
    ...HomePage,
    path: "/",
    exact: true,
  },
  {
    ...UsersListPage,
    path: "/users",
  },
];
