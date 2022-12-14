import React from "react";
import { useContext, useEffect } from "react";
import { LogInContext } from "../context/logInContext";
import Button from "@mui/material/Button";

function Profile() {
  const { user, updateUserEmail, updateUserDisplayName, errorMessage } =
    useContext(LogInContext);

  const handleUpdateEmail = () => {
    // console.log("clicked");
    let newEmail = prompt("Enter your new email address", "email@email.com");
    updateUserEmail(newEmail);
    // console.log(newEmail);
  };

  const handleUpdateDisplayName = () => {
    // console.log("clicked");
    let newName = prompt("Enter your new display name", "e.g. Jane");
    updateUserDisplayName(newName);
    // console.log(newName);
  };

  const handleUpdatePassword = () => {
    alert("Sorry, not possible at the moment 😢");
  };

  return user ? (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        rowGap: "5vh",
        height: "80vh",
      }}
    >
      <p style={{ fontSize: "30px" }}>
        {" "}
        Hey <span style={{ fontWeight: "bold" }}>{user.displayName}</span> ! 👋
      </p>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Your username: {user.displayName}</p>
        <Button
          style={{ marginLeft: "10px" }}
          color="action"
          size="small"
          variant="outlined"
          onClick={handleUpdateDisplayName}
        >
          Change
        </Button>
      </div>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <p>Your email: {user.email}</p>
        <Button
          style={{ marginLeft: "10px" }}
          color="action"
          size="small"
          variant="outlined"
          onClick={handleUpdateEmail}
        >
          Change
        </Button>
      </div>
      <div>
        <Button
          color="action"
          variant="outlined"
          size="small"
          onClick={handleUpdatePassword}
        >
          Change your password
        </Button>
      </div>
      {errorMessage ? (
        <p style={{ color: "red" }}> {errorMessage} 😢 Try again!</p>
      ) : (
        <p></p>
      )}
    </div>
  ) : (
    <p>Fetching data</p>
  );
}

export default Profile;
