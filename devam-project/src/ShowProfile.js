import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

function ShowProfile() 
{
  const { username } = useParams();
  const [profile, setProfile] = useState([]);
  const [isChangingPassword, setChangingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    const getProfile = async () => {
      try {
        const response = await fetch(
          `http://localhost:8080/getProfile?username=${username}`
        );
        const data = await response.json();
        setProfile(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    getProfile();
  }, [username]);

  const handlePasswordChange = async () => {
    // Check if the current password matches
    const isCurrentPasswordCorrect = await checkCurrentPassword(currentPassword);

    if (isCurrentPasswordCorrect) 
    {
        await changePassword(newPassword);
        setCurrentPassword("");
        setNewPassword("");
        setChangingPassword(false);
    } 
    else 
    {
        console.error("Incorrect current password");
    }
  };

  const checkCurrentPassword = async (password) => {
    if(profile)
    {
        if(profile.password === password)
        {
            return true;
        }
        else
        {
            return false;
        }
    }
    else
    {
        return false;
    }
  };

  const changePassword = async (newPassword) => {
    // console.log("Changing password to:", newPassword);
    fetch(`http://localhost:8080/changePassword`,
    {
        method: 'POST',
        body: new URLSearchParams({
            username: username,
            newPassword: newPassword
        }),
        headers:
        {
            'content-type': "application/x-www-form-urlencoded"
        }
    }).then(alert("password updated")).catch((error)=>console.log(error));
  };

  return (
    <>
      <h2>User Profile: {username}: </h2>
      <div>
        <h7>username: {profile.username}</h7>
        <br />
        <h7>name: {profile.firstName + profile.lastName}</h7>
        <br />
        <h7>badge: {profile.badge}</h7>
      </div>
      <br />
      {isChangingPassword ? (
        <>
          <div>
            <label>
              Current Password:
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label>
              New Password:
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
          </div>
          <button onClick={handlePasswordChange}>Change Password</button>
        </>
      ) : (
        <button onClick={() => setChangingPassword(true)}>Change Password</button>
      )}
      <br />
      <Link to={`/getChannels/${username}`}>Channels</Link>
      <br />
    </>
  );
};

export default ShowProfile;
