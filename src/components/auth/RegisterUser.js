import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css"

export const RegisterUser = (props) => {
  const [customer, setCustomer] = useState({
    email: "",
    name: "",
    isBand: false,
  });

  let navigate = useNavigate();

  const registerNewUser = () => {
    return fetch("http://localhost:8088/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(customer),
    })
      .then((res) => res.json())
      .then((createdUser) => {
        if (createdUser.hasOwnProperty("id")) {
          localStorage.setItem(
            "bb_user",
            JSON.stringify({
              id: createdUser.id,
              email: createdUser.email,
              name: createdUser.name,
              isBand: createdUser.isBand,
            })
          );

          navigate(`/register/profile/${createdUser.id}`);
        }
      });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    return fetch(`http://localhost:8088/users?email=${customer.email}`)
      .then((res) => res.json())
      .then((response) => {
        if (response.length > 0) {
          // Duplicate email. No good.
          window.alert("Account with that email address already exists");
        } else {
          // Good email, create user.
          registerNewUser();
        }
      });
  };

  return (

    <>
        
          <main className="container container_register">
            <form className="form--login" onSubmit={handleRegister}>
              <h2 className="h3 mb-3 font-weight-normal">Register below:</h2>
              <label htmlFor="name"> Full Name </label>
              <input
                onChange={(evt) => {
                  const copy = { ...customer };
                  copy.name = evt.target.value;
                  setCustomer(copy);
                }}
                type="text"
                id="name"
                className="form-control input_reg input_field_colors"
                placeholder="Enter your name"
                required
                autoFocus
              />
              <label htmlFor="email"> Email address </label>
              <input
                onChange={(evt) => {
                  const copy = { ...customer };
                  copy.email = evt.target.value;
                  setCustomer(copy);
                }}
                type="email"
                id="email"
                className="form-control input_reg input_field_colors"
                placeholder="Email address"
                required
              />
              <fieldset className="container container_isBandCheck">
                <label htmlFor="isBand"> Sign up as a band? </label>
                <input
                  onChange={(evt) => {
                    const copy = { ...customer };
                    copy.isBand = evt.target.checked;
                    setCustomer(copy);
                  }}
                  type="checkbox"
                  id="isBand"
                  name="isBand"
                  className="isBandCheckbox"
                  
                />
              </fieldset>
             
                <button type="submit" className="button_profile_colors button-loginreg"> Register </button>
              
            </form>
          </main>
          <div className="waves-user-transparent"></div>

    </>
  );
};
