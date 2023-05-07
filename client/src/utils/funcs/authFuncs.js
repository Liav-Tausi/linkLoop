import axios from "axios";
import { URL, APIV1, AUTH} from "../config/conf";
import jwt_decode from "jwt-decode";

export const isLoggedIn = async (accessToken) => {
  const access = accessToken;
  if (await access) {
    return access;
  } else {
    const refresh = localStorage.getItem("refresh");
    if (refresh) {
      return await handleRefreshTokenResponse(refresh);
    } else {
      return false;
    }
  }
};


export const signUpWithGoogle = async (credential) => {
  try {
    if (credential) {
      const response = await axios.post(
        `${URL}${APIV1}${AUTH}google_client_id/`,
        {
            credential: credential,
        }
      );
      if (response.status < 300) {
          const decodedToken = jwt_decode(credential);
          const accessTokenResponse = await handleAccessTokenResponse([
            decodedToken.email,
            decodedToken.sub + decodedToken.email,
        ]);
        if (accessTokenResponse) {
          localStorage.setItem("refresh", accessTokenResponse.data.refresh);
        }
        return accessTokenResponse.data.access;
      } else {
        return false;
      }
    }
  } catch (error) {
    return false;
  }
};


export const handleRefreshTokenResponse = async (refreshToken) => {
  try {
    const tokenResponse = await axios.post(
      `${URL}${APIV1}${AUTH}token/refresh/`,
      {
        refresh: refreshToken,
      }
    );
    if (tokenResponse.status < 300) {
      return tokenResponse.data.access;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};

export const handleAccessTokenResponse = async (user) => {
  try {
    const tokenResponse = await axios.post(`${URL}${APIV1}${AUTH}token/`, {
      username: user[0],
      password: user[1],
    });
    if (tokenResponse.status < 300) {
      return tokenResponse;
    } else {
      return false;
    }
  } catch {
    return false;
  }
};



export const signUpUser = async (user) => {
  try {
    const response = await axios.post(`${URL}${APIV1}users/signup/`, {
      username: user[0].value,
      first_name: user[1].value.split(" ")[0],
      last_name: user[1].value.split(" ")[1],
      email: user[0].value,
      password: user[2].value,
      confirm_password: user[4].value,
      is_staff: false,
    });
    if (response.status === 201) {
      const username = user[0].value;
      const password = user[2].value;
      const accessTokenResponse = await handleAccessTokenResponse([
        username,
        password,
      ]);
      if (accessTokenResponse.status < 300) {
        localStorage.setItem("refresh", accessTokenResponse.data.refresh);
        return accessTokenResponse.data.access;
      }
    } else {
      throw new Error(response);
    }
  } catch (error) {
    if (error.response) {
      const errorArray = Object.values(error.response.data);
      return errorArray;
    } else {
      return error;
    }
  }
};

export const signInUser = async (user) => {
  const username = user[0].value;
  const password = user[1].value;
  const accessTokenResponse = await handleAccessTokenResponse([
    username,
    password,
  ]);
  if (accessTokenResponse.status < 300) {
    localStorage.setItem("refresh", accessTokenResponse.data.refresh);
    return accessTokenResponse.data.access;
  } else {
    return false;
  }
};

export const logOut = async (refreshToken) => {
  try {
    const response = await axios.post(`${URL}${APIV1}${AUTH}token/blacklist/`, {
      refresh: refreshToken,
    });
    if (response.status < 300) {
      localStorage.removeItem("refresh");
      return true;
    } else {
      return false;
    }
  } catch (error) {
    return false;
  }
};
