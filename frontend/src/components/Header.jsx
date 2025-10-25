import { Link } from 'react-router-dom'
import './Header.css'

function Header() {
    return (
        <header className="header-container">
            <div className="header-content">
                <Link className='logo' to='/'>Cine TV App</Link>
                <nav className="nav-links">
                    <Link className='nav-link' to='/'>Início</Link>
                    <Link className='nav-link favoritos' to='/favoritos'>Meus Favoritos</Link>
                </nav>
            </div>
        </header>
    )
}

export default Header