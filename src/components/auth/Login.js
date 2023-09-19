import React, { useState } from "react"
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import FadeIn from 'react-fade-in';
import "./Login.css"

export const Login = () => {
    const [email, set] = useState("")
    const navigate = useNavigate()

    const handleLogin = (e) => {
        e.preventDefault()

        return fetch(`http://localhost:8088/users?email=${email}`)
            .then(res => res.json())
            .then(foundUsers => {
                if (foundUsers.length === 1) {
                    const user = foundUsers[0]
                    localStorage.setItem("bb_user", JSON.stringify({
                        id: user.id,
                        isBand: user.isBand,
                        name: user.name
                    }))

                    navigate("/")
                }
                else {
                    window.alert("Invalid login")
                }
            })
    }

    const handleRegisterClick = () => {
        navigate('/register/user')
    }

    return (
        <>

            {/* copied over homepage content for background and logos, leaving css the same here for that part of it */}

            
            <div className="container container_all_login_content">
                    <section className="container container_hero container_hero_login">
                        <header className="container container_heading">
                            <img className="heading heading_app_title" src={require("../../images/Bandblend_Logos/Logo-top-black.png")} />
                            <img className="heading heading_app_subtitle" src={require("../../images/Bandblend_Logos/Logo-bot-black.png")} />
                        </header>
                    </section>

                  
            <FadeIn>

                    <main className="container--login">
                        
                            <form className="form--login" onSubmit={handleLogin}>
                                <h2>Returning Blender?</h2>
                                    <label htmlFor="inputEmail"> Sign in with email address:</label>
                                    <input type="email"
                                        value={email}
                                        onChange={evt => set(evt.target.value)}
                                        className="form-control input_field_colors input_login"
                                        placeholder="Email address"
                                        required autoFocus />
                                    <button type="submit" className="button_profile_colors button-loginreg">
                                        Sign in
                                    </button>
                            </form>
                       
                        <section className="section--register">
                            <h2>New to the Blend?</h2>
                            <button type="submit" className="button_profile_colors button-loginreg" onClick={handleRegisterClick}>Register</button>
                        </section>
                    </main>
                    </FadeIn>
                    </div>
                    <div className="waves-login-transparent"></div>
              


        </>
    )
}

