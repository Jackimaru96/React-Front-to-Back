import { createContext, useReducer } from "react";
import GithubReducer from "./GithubReducer";

const GithubContext = createContext();

const GITHUB_URL = process.env.REACT_APP_GITHUB_URL;
const GITHUB_TOKEN = process.env.REACT_APP_GITHUB_TOKEN;
const initialState = {
  users: [],
  isLoading: false,
};

export const GithubProvider = ({ children }) => {
  const [state, dispatch] = useReducer(GithubReducer, initialState);

  // Set Loading
  const setLoading = () => dispatch({ type: "SET_LOADING" });

  // Get search users results
  const searchUsers = async (text) => {
    setLoading();

    const params = new URLSearchParams({
      q: text,
    });

    const response = await fetch(`${GITHUB_URL}/search/users?${params}`, {
      headers: {
        Authorization: `token ${GITHUB_TOKEN}`,
      },
    });

    const { items } = await response.json();

    dispatch({
      type: "GET_USERS",
      payload: items,
    });
  };

  // clear search results
  const clearUsers = () =>
    dispatch({
      type: "CLEAR_USERS",
      payload: [],
    });

  // If we add the function as a dependency in
  // children's useEffect() dep array, we need to
  // memoize the function
  // Get initial users (testing function)
  //   const fetchUsers = useCallback(async () => {
  //     setLoading();
  //     const response = await fetch(`${GITHUB_URL}/users`, {
  //       headers: {
  //         Authorization: `token ${GITHUB_TOKEN}`,
  //       },
  //     });

  //     const data = await response.json();

  //     dispatch({
  //       type: "GET_USERS",
  //       payload: data,
  //     });
  //   }, []);

  //   const fetchUsers = async () => {
  //     const response = await fetch(`${GITHUB_URL}/users`, {
  //       headers: {
  //         Authorization: `token ${GITHUB_TOKEN}`,
  //       },
  //     });

  //     const data = await response.json();

  //     dispatch({
  //       type: "GET_USERS",
  //       payload: data,
  //     });
  //   };

  return (
    <GithubContext.Provider
      value={{
        users: state.users,
        isLoading: state.isLoading,
        searchUsers,
        clearUsers,
      }}
    >
      {children}
    </GithubContext.Provider>
  );
};

export default GithubContext;