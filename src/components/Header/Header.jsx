import logo from "../../images/header.png";
import CurrentUserContext from "../../contexts/CurrentUserContext";
import { useContext, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "../../blocks/header.css";

export default function Header() {
  const { isLoggedIn, currentUser, setIsLoggedIn, setCurrentUser } =
    useContext(CurrentUserContext);

  const navigate = useNavigate();

  const location = useLocation();

  const [menuOpen, setMenuOpen] = useState(false);

  function toggleMenu() {
    setMenuOpen(!menuOpen);
  }

  let headerLink;

  if (isLoggedIn) {
    headerLink = (
      <ul className={`header_nav ${menuOpen ? "header_nav_open" : ""}`}>
        <li className="header__email">{currentUser.email}</li>
        <li>
          <button
            className="header__button header__button_signout"
            onClick={signOut}
          >
            Sair
          </button>
        </li>
      </ul>
    );
  }

  if (location.pathname === "/signup") {
    headerLink = (
      <Link className="header__button" to="/signin">
        Faça o login
      </Link>
    );
  }

  if (location.pathname === "/signin") {
    headerLink = (
      <Link className="header__button" to="/signin">
        Entrar
      </Link>
    );
  }

  function signOut() {
    localStorage.removeItem("jwt"); // remove o localstorage da memória do browser
    setIsLoggedIn(false);
    setCurrentUser(null);
    navigate("/signin");
  }

  return (
    <header className="header">
      <img src={logo} alt="Around the U.S logo" className="header__logo" />
      {/* BOTÃO HAMBÚRGUER (mobile) */}
      <button
        className={`header__burger ${menuOpen ? "header__burger_active" : ""}`}
        onClick={toggleMenu}
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* MENU */}
      {headerLink}
    </header>
  );
}
