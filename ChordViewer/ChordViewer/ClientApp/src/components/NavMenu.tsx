import React, {useContext} from 'react';
import {Button, Container, Navbar, NavbarBrand} from 'reactstrap';
import { Link } from 'react-router-dom';
import './NavMenu.css';
import { UserContext } from '../App';
import {Constants} from "../models/Constants";
import {BackendService} from "../service/BackendService";
import {User} from "../models/BackendModels";
import LocalizedStrings from "react-localization";

const NavMenu = () => {
  let [currentUser, setCurrentUser]: [User, (user: User)=>void] = useContext(UserContext);
  let logout = ()=>{
    BackendService.LogOut().then(()=>setCurrentUser(Constants.defaultUser));
  }
  const localization = new LocalizedStrings({
    en: {
      home: "Home",
      title: "Chord Viewer",
      login: "Log in",
      sign_up: "Sign up",
      logged_in_as: "Logged in as ",
      log_out: "Log out"
    },
    sk: {
      title: "Zobrazovač akordov",
      login: "Prihlásenie",
      sign_up: "Registrácia",
      logged_in_as: "Prihlsený ako ",
      log_out: "Odhlásiť sa"
    }
  });
  return (
      <header>
        <Navbar className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavbarBrand tag={Link} to="/">ChordViewer</NavbarBrand>
            <div style={{"float": "right", "display": "inline"}} >
              {currentUser.id !== 0 && (<span>{localization.logged_in_as} <Link to="/profile" className={"me-2"}>{currentUser.userName}</Link></span>)}
              {currentUser.id !== 0 && (<Button className={"me-2"} variant={"outline-dark"} onClick={logout}>{localization.log_out}</Button>)}
              {currentUser.id !== 0 || (<Link to="/login" className={"btn btn-primary me-2"}>{localization.login}</Link>)}
              {currentUser.id !== 0 || (<Link to="/signup" className={"btn btn-outline-dark me-2"}>{localization.sign_up}</Link>)}
            </div>
          </Container>
        </Navbar>
      </header>
  );
}

export default NavMenu;
