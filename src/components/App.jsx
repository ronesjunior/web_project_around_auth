import Header from "./Header/Header.jsx";
import Main from "./Main/Main.jsx";
import Footer from "./Footer/Footer.jsx";
import RemoveCard from "./RemoveCard/RemoveCard.jsx";
import "../index.css";
import { useState, useEffect } from "react";
import { api } from "../utils/api";
import CurrentUserContext from "../contexts/CurrentUserContext.js"; // import da const CurrentUserContext

// Componente funcional React para montar a interface da aplicação, ou seja, o pai de todos os outros componentes
export default function App() {
  const [currentUser, setCurrentUser] = useState(null); //variável de estado para o usuário

  const [popup, setPopup] = useState(null);

  const [selectedImage, setSelectedImage] = useState(null);

  const [cards, setCards] = useState([]);

  useEffect(() => {
    api
      .getInitialCards()
      .then((res) => {
        setCards(res); // variável cards recebe o res
      })
      .catch((err) => console.error("Erro ao buscar cards:", err));
  }, []);

  function handleCardLike(card) {
    api
      .changeLikeCardStatus(card._id, !card.isLiked)
      .then((newCard) => {
        // recebe a promisse 'res' resolvida e após isso executa a resolução da promisse'newCard' que é o objeto com o _id, name, link, isLiked... de 01 card que veio resolvida da API 'changeLikeCardStatus'
        setCards(
          (
            state // 'state' é o array atual da variável de estado 'cards' usesState, array com todos os objetos//
          ) =>
            state.map((currentCard) =>
              currentCard._id === card._id ? newCard : currentCard
            )
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

  useEffect(() => {
    api
      .getUserInfo()
      .then((userData) => {
        setCurrentUser(userData);
      })
      .catch((err) => {
        console.error("Erro ao buscar dados do usuário:", err);
      });
  }, []); // [] indica para o useEffect para rodar apenas uma vez

  function handleOpenPopup(popupData) {
    console.log("popupdata = ", popupData);
    setPopup(popupData);
  }

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
      }}
    >
      {/* distribui o valor de currentUser em Header, Main e Footer*/}
      <div className="page">
        <div className="page__content">
          <Header /> {/* componente filho Header.jsx início da aplicação */}
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
          {/*enviar para o componente Main.jsx a prop chamada 'currentUser' com a variável chamada 'currentUser' criada com o UseState */}
          {/* componente filho Main.jsx no meio da aplicação */}
          <Footer /> {/* componente filho Footer.jsx no final da aplicação */}
        </div>
      </div>
    </CurrentUserContext.Provider>
  );
}
