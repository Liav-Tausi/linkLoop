import { useContext, useEffect, useState } from "react";
import { Route, Routes } from "react-router-dom";
import DARK_THEME from "../../assets/themes/DarkTheme";
import {
  AppContext,
  AppDispatchContext,
  APP_ACTIONS,
  Ref,
} from "../AppStates/AppReducer";
import FeedPage from "../../pages/FeedPage/FeedPage";
import Home from "../../pages/Home/Home";
import NotFound from "../../pages/NotFound/NotFound";
import AppLoading from "./AppLoading";
import "./App.css";
import { isLoggedIn } from "../../utils/funcs/authFuncs";
import ProfilePage from "../../pages/ProfilePage/ProfilePage";

const App = () => {
  const {
    themeMode,
    appLoaded,
    signUpOpen,
    signInOpen,
    profilePatch,
    menuOpen,
    accessToken,
    chooseLocation,
  } = useContext(AppContext);
  const dispatch = useContext(AppDispatchContext);
  const ref = useContext(Ref);

  useEffect(() => {
    if (signUpOpen || signInOpen || profilePatch) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [signUpOpen, signInOpen, profilePatch]);

  useEffect(() => {
    const fetchData = async () => {
      const result = await isLoggedIn(accessToken);
      dispatch({
        type: APP_ACTIONS.ACCESS_TOKEN,
        payload: result,
      });
    };
    fetchData();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch({ type: APP_ACTIONS.APP_LOADED });
    }, 1600);

    return () => {
      clearTimeout(timer);
    };
  }, [dispatch]);

  useEffect(() => {
    if (themeMode === DARK_THEME) {
      document.body.classList.add("dark-mode");
      document.body.classList.remove("light-mode");
    } else {
      document.body.classList.add("light-mode");
      document.body.classList.remove("dark-mode");
    }
  }, [themeMode, dispatch]);

  const closeWhenOutside = (event) => {
    if (ref.current && !ref.current.contains(event.target)) {
      if (ref.current.id === "signUp" && signUpOpen) {
        dispatch({
          type: APP_ACTIONS.SIGN_UP_OPEN,
        });
      } else if (ref.current.id === "signIn" && signInOpen) {
        dispatch({
          type: APP_ACTIONS.SIGN_IN_OPEN,
        });
      } else if (
        ref.current.id === "profilePatch" &&
        profilePatch &&
        !chooseLocation
      ) {
        dispatch({
          type: APP_ACTIONS.PROFILE_PATCH,
        });
      } else if (
        ref.current.id === "menu" &&
        menuOpen &&
        event.target.id !== "hamburgerMenu"
      ) {
        dispatch({
          type: APP_ACTIONS.MENU_OPEN_CLOSE,
        });
      }
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeWhenOutside);
    return () => {
      document.removeEventListener("mousedown", closeWhenOutside);
    };
  }, [closeWhenOutside]);

  if (!appLoaded) {
    return <AppLoading />;
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />}>
          <Route path="/" element={<FeedPage />} />
          <Route path="profile/:username" element={<ProfilePage />} />
          <Route path="*" element={<NotFound />} />
        </Route>
      </Routes>
    </>
  );
};

export default App;
