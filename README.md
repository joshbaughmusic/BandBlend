BandBlend is a React JS-based front-end capstone that serves as a social media platform tailored for musicians and bands. The platform facilitates connections among users, aiding in the search for potential members and collaborators. Users can create profiles, post content, comment, message each other, and engage with posts. The search feature allows users to find members based on location/distance, instrument, genre, and more. Additionally, the messaging system incorporates a chatbot for interactive site engagement. The project integrates APIs like GraphHopper and OpenAI, and styling is achieved using CSS. Ant Design components are used for modals and dropdown menus.

Technologies used:
ReactJS | CSS | HTML 

Video walkthrough:
https://www.youtube.com/watch?v=fEymZ2LOXd8&ab_channel=JoshBaugh

How to set up the project for local use:

1. From the terminal, go to the file directory on your computer that you would like to install the application in.
2. In that directory, run "git clone git@github.com:joshbaughmusic/BandBlend.git"
3. If you are using VS Code, run "code ." to open the application in VS Code.
4. Run "npm install --force" from the main application directory to install all dependencies.
5. Get an API key from GraphHopper.
   1. Go to https://graphhopper.com/dashboard/#/signup and register for an account.
   2. Once you are logged in, from the dashboard, click on "API Keys" in the top   navigation bar.
   3. Click "Add API Key", enter any description, and click "Add key".
6. Get an API key and Organization ID from OpenAI. Make sure to copy this.
   1. Go to https://auth0.openai.com/u/signup and register for an account.
   2. Once you are logged in, from the dashboard, click on your profile picture in the top navigation bar, then click "View API Keys".
   3. Click add "Create new secret key", enter any name, and click "Create secret key". Make sure to copy this.
   4. Click on your profile icon again, then click "Manage Account".
   5. Copy the organization ID.
7. In the application, go to the userApiKeys.js file. In between the quotations, paste your API keys in their respective positions.
8. Go to the NewMessage.js file, and between the "" on line 20, paste the Organization ID from Open AI.
9. From the main application directory, go to the "bandblend-api" directory and run "json-server -p 8088 --host 127.0.0.1 database.json -w"
10. Go back to the main application directory and run "npm start". This should open up a web browser with the application running.
11. Click on "Register" to enter your details, create an account, and start using the app!
