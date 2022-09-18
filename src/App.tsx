import React from "react";
import "./App.scss";
import { CustomerHome } from "./components/CustomerHome/CustomerHome";
import { MyForm } from "./components/Form/Form";
import { Home } from "./components/Home";
import { NewCalc } from "./components/NewCalc";

function App() {
  const isLoggedIn = () => {
    return localStorage.getItem("isLoggedIn")?.length;
  };

  const [active, setActive] = React.useState(isLoggedIn() ? "Home" : "Login");
  const [customerData, setCustomerData] = React.useState({});
  const [newCalcData, setNewCalcData] = React.useState({});
  const [isEdit, setEdit] = React.useState({
    isEdit: false,
    editValues: { isCust: null },
  });

  const renderContent = (key: string) => {
    switch (key) {
      case "Login":
        return (
          <div className="login-main">
            <h1>Login to Use this app</h1>
            <MyForm
              onSubmit={(hasLoggedIn: any) => {
                if (hasLoggedIn) {
                  setActive("Home");
                  localStorage.setItem("isLoggedIn", "isLoggedIn");
                }
              }}
            />
          </div>
        );
      case "Home":
        return (
          <Home
            setActive={(name: any) => {
              setCustomerData(name);
              setActive(name);
            }}
          />
        );

      case "NEWCALC":
        return (
          <NewCalc
            isEdit={isEdit.isEdit}
            onBack={() => setActive("")}
            data={newCalcData}
            isCust={false}
            editValues={isEdit.editValues}
          />
        );
      case "NEWCALCCUST":
        return (
          <NewCalc
            isEdit={isEdit.isEdit}
            onBack={() => setActive("")}
            isCust
            data={newCalcData}
            editValues={isEdit.editValues}
          />
        );
      case "EDIT_CALC":
        return (
          <NewCalc
            isCust={isEdit.editValues.isCust}
            onBack={() => setActive("")}
            isEdit={isEdit.isEdit}
            editValues={isEdit.editValues}
            data={newCalcData}
          />
        );
      default:
        return (
          <CustomerHome
            addNewCalc={(data: any, isNew: any) => {
              if (isNew) {
                setActive(isNew);
                setNewCalcData(data);
              }
            }}
            setEdit={(data: any, values: any) => {
              setActive("EDIT_CALC");
              console.log(">> data", data);
              setEdit({
                isEdit: true,
                editValues: { ...data },
              });
              setNewCalcData(values);
            }}
            onBack={() => setActive("Home")}
            data={customerData}
          />
        );
    }
  };

  return <div className="App">{renderContent(active)}</div>;
}

const GlobalProvider = () => {
  return <App />;
};

export default GlobalProvider;
