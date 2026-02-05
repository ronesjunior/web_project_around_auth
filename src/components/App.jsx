import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import RemoveCard from "./RemoveCard/RemoveCard.jsx";
// import "../index.css";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import { Route, Routes, useNavigate } from "react-router-dom";
import Register from "./Register/Register.jsx";
import CurrentUserContext from "../contexts/CurrentUserContext.js"; // import da const CurrentUserContext
// Componente funcional React para montar a interface da aplicação, ou seja, o pai de todos os outros componentes
import { auth } from "../utils/auth.js";
import { setToken, getToken } from "../utils/token.js";
import Login from "./Login/Login.jsx";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute.jsx";

export default function App() {
  const [currentUser, setCurrentUser] = useState(null); //variável de estado para o usuário

  const [popup, setPopup] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [cards, setCards] = useState([]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res); // variável cards recebe o res
      })
      .catch((err) => console.error("Erro ao buscar cards:", err));
  }, []);

  useEffect(() => {
    const jwt = getToken();

    if (!jwt) {
      return;
    }
    auth.getUserAuth(jwt).then((response) => {
      const email = { email: response.data.email };
      setCurrentUser((prevData) => ({ ...prevData, ...email }));
      setIsLoggedIn(true);
      navigate("/");
    });
  }, [navigate]);

  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do usuário:", err);
      });
  }, []);

  function handleCardLike(card) {
    api
      .changeLikeCardStatus(card._id, !card.isLiked)
      .then((newCard) => {
        // recebe a promisse 'res' resolvida e após isso executa a resolução da promisse'newCard' que é o objeto com o _id, name, link, isLiked... de 01 card que veio resolvida da API 'changeLikeCardStatus'
        setCards(
          (
            state, // 'state' é o array atual da variável de estado 'cards' usesState, array com todos os objetos//
          ) =>
            state.map((currentCard) =>
              currentCard._id === card._id ? newCard : currentCard,
            ),
        );
      })
      .catch((error) => console.error(error));
  }

  function handleCardDelete(card) {
    handleOpenPopup({
      title: "Tem certeza?",
      children: <RemoveCard onConfirm={() => handleConfirmDelete(card)} />,
    });
  }

  function handleConfirmDelete(card) {
    api
      .handleDeleteClick(card._id)
      .then(() => {
        setCards((state) => state.filter((c) => c._id !== card._id));
        handleClosePopup();
      })
      .catch(console.error);
  }

  function handleOpenPopup(popupData) {
    console.log("popupdata = ", popupData);
    setPopup(popupData);
  }

  const handleRegistration = ({ email, password }) => {
    auth
      .register({ email, password })
      .then(() => {
        alert("Vitória! Você precisa ser registrar");
        // const infoTolltip = {
        //   children: (
        //     <infoTolltip
        //       icon={signupSuccess}
        //       message="Vitória! Você precisa ser registrar"
        //     />
        //   ),
        // };
        // handleOpenPopup(infoTolltip);
        navigate("/");
      })
      .catch((error) => {
        console.log("error", error);
        alert("Ops, algo saiu de errado! Por favor, tente novamente.");
        // const infoToollip = {
        //   children: (
        //     <infoTolltip
        //       icon={signupFail}
        //       message="Ops, algo saiu de errado! Por favor, tente novamente."
        //     />
        //   ),
        // };
        // handleOpenPopup(infoToollip);
      });
  };

  const handleLogin = ({ email, password }) => {
    auth
      .login({ email, password })
      .then((response) => {
        setCurrentUser((prevData) => ({ ...prevData, ["email"]: email }));
        setToken(response.token);
        setIsLoggedIn(true);
        navigate("/");
      })
      .catch((error) => {
        console.log("error", error);
        alert("Ops, algo saiu de errado! Por favor, tente novamente.");
        // const infoToollip = {
        //   children: (
        //     <infoTolltip
        //       icon={signupFail}
        //       message="Ops, algo saiu de errado! Por favor, tente novamente."
        //     />
        //   ),
        // };
        // handleOpenPopup(infoToollip);
      });
  };

  function handleClosePopup() {
    setPopup(null);
    setSelectedImage(null);
  }

  const handleUpdateUser = (data) => {
    api
      .updateUserInfo(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error("Erro ao atualizar usuário:", error));
  };

  const handleUpdateAvatar = (data) => {
    api
      .updateUserAvatar(data)
      .then((newData) => {
        setCurrentUser(newData);
        handleClosePopup();
      })
      .catch((error) => console.error("Erro ao atualizar usuário:", error));
  };

  // async function handleCardLike(card) {
  //   const isLiked = card.isLiked;

  //   await api
  //     .changeLikeCardStatus(card._id, !isLiked)
  //     .then((newCard) => {
  //       setCards((state) =>
  //         state.map((currentCard) =>
  //           currentCard._id === card._id ? newCard : currentCard,
  //         ),
  //       );
  //     })
  //     .catch((error) => console.error(error));
  // }

  // async function handleCardDelete(card) {
  //   await api
  //     .removeCard(card._id)
  //     .then(() => {
  //       setCards((state) =>
  //         state.filter((currentCard) => currentCard._id !== card._id),
  //       );
  //     })
  //     .catch((error) => console.error(error));
  // }

  const handleAddPlaceSubmit = (data) => {
    api
      .addCard(data)
      .then((newCard) => {
        setCards((prevCards) => [newCard, ...prevCards]);
        handleClosePopup();
      })
      .catch((error) => console.error("Erro ao atualizar usuário:", error));
  };

  return (
    <CurrentUserContext.Provider
      value={{
        currentUser,
        handleUpdateUser,
        handleUpdateAvatar,
        handleAddPlaceSubmit,
        isLoggedIn,
        setIsLoggedIn,
        setCurrentUser,
      }}
    >
      {/* distribui o valor de currentUser em Header, Main e Footer*/}
      <div className="page">
        <div className="page__content">
          <Header />{" "}
          {/* componente filho Header.jsx início da aplicação e fica de forado 'Routes' para sempre aparecer*/}
          <Routes>
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <Main
                    popup={popup}
                    selectedImage={selectedImage}
                    onOpenPopup={handleOpenPopup}
                    onClosePopup={handleClosePopup}
                    setSelectedImage={setSelectedImage}
                    cards={cards}
                    onCardLike={handleCardLike}
                    onCardDelete={handleCardDelete}
                  />
                </ProtectedRoute>
              }
            ></Route>
            <Route
              path="/signup"
              element={<Register handleRegistration={handleRegistration} />}
            ></Route>
            <Route
              path="/signin"
              element={<Login handleLogin={handleLogin} />}
            ></Route>
          </Routes>
          {/*enviar para o componente Main.jsx a prop chamada 'currentUser' com a variável chamada 'currentUser' criada com o UseState */}
          {/* componente filho Main.jsx no meio da aplicação */}
          <Footer /> {/* componente filho Footer.jsx no final da aplicação */}
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
