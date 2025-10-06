import { Switch, Route, Redirect } from "react-router-dom";

import Layout from "./components/Layout/Layout";
import UserProfile from "./components/Profile/UserProfile";
import AuthPage from "./pages/AuthPage";
import HomePage from "./pages/HomePage";
import { useContext, useEffect } from "react";
import AuthContext from "./store/auth-context";

function App() {
  const authCtx = useContext(AuthContext);

  useEffect(() => {
    const checkToken = async () => {
      if (!authCtx.token) {
        authCtx.logout();
        return;
      }

      try {
        const res = await fetch(
          "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyDpWVsvC9evJbXOQnZHUyAxGQIOfLTaZOs",
          {
            method: "POST",
            body: JSON.stringify({ idToken: authCtx.token }),
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!res.ok) {
          authCtx.logout();
        }
      } catch (err) {
        authCtx.logout();
      }
    };

    checkToken();
  }, [authCtx.token]);
  return (
    <Layout>
      <Switch>
        <Route path="/" exact>
          <HomePage />
        </Route>
        {!authCtx.isLoggedIn && (
          <Route path="/auth">
            <AuthPage />
          </Route>
        )}
        <Route path="/profile">
          {authCtx.isLoggedIn && <UserProfile />}
          {!authCtx.isLoggedIn && <Redirect to="/auth" />}
        </Route>
        <Route path="*">
          <Redirect to="/" />
        </Route>
      </Switch>
    </Layout>
  );
}

export default App;
