import { useEffect, useState } from "react";
import './SaveButtonList.css';

export const SaveButtonList = ({ profileId, saveListener, setSaveListener }) => {
  // getting id of current profile from other profile

  const [savedProfiles, setSavedProfiles] = useState([]);

  //get and store ID of currently logged in user:
  const localBbUser = localStorage.getItem("bb_user");
  const bBUserObject = JSON.parse(localBbUser);

  //get all saved profiles on render

  useEffect(() => {
    fetch(`http://localhost:8088/savedProfiles`)
      .then(res => res.json())
      .then(data => {
        setSavedProfiles(data);
      });
  }, []);

  // Determine if the profile is saved for the current user
  const isProfileSaved = savedProfiles.some(
    savedProfile => savedProfile.userId === bBUserObject.id && savedProfile.profileId === parseInt(profileId)
  );

  //create an event handler function for when the save button is clicked
  const handleSaveButtonClick = e => {
    if (isProfileSaved) {
      const foundSavedProfileObj = savedProfiles.find(savedProfile =>
        savedProfile.userId === bBUserObject.id && savedProfile.profileId === parseInt(profileId)
      );

      fetch(`http://localhost:8088/savedProfiles/${foundSavedProfileObj.id}`, {
        method: "DELETE",
      }).then(() => {
        setSavedProfiles(savedProfiles.filter(savedProfile => savedProfile !== foundSavedProfileObj));
        setSaveListener(!saveListener)

      });
    } else {
      const newSavedProfile = {
        profileId: parseInt(profileId),
        userId: bBUserObject.id,
      };

      fetch(`http://localhost:8088/savedProfiles`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(newSavedProfile),
      }).then(res => res.json())
        .then(data => {
          setSavedProfiles([...savedProfiles, data]);
          setSaveListener(!saveListener)
        });
    }
    
  };

  return (
    <>
      {isProfileSaved ? (
        <img
          src={require("../../images/saved.png")}
          id={`saved--${profileId}--${bBUserObject.id}`}
          className="icon icon_save icon_profile_primary_saved"
          onClick={handleSaveButtonClick}
        />
      ) : (
        <img
          src={require("../../images/nonsaved.png")}
          id={`nonsaved--${profileId}--${bBUserObject.id}`}
          className="icon icon_save icon_profile_primary_nonsaved"
          onClick={handleSaveButtonClick}
        />
      )}
    </>
  );
};
