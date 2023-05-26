import { NavLink  } from 'react-router-dom';
import NetworkBanner from "./NetworkBanner";
import Header from "./Header";
import MintButton from "./MintButton";

const NavBar = () => {
 return (
 <nav className="navbar navbar-expand-lg navbar-light bg-light">
    <ul>
        <li>
            <NavLink to="/">Home</NavLink>
        </li>
        {/* <li>
            <NetworkBanner />
        </li> */}
        <li>
            <Header />
        </li>
        <li>
            <MintButton />
        </li>
    </ul>
 </nav>
 );
};

export default NavBar;