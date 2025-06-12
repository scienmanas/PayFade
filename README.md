# PayFade

Payfade is an open source application for developers to make sure your client pays for your work. It's an improved and web-based version of [Client Did Not Pay](https://github.com/kleampa/not-paid) js file. This project extends the mentioned repo's idea and gives complete credits of this creativity to the original inventors of this idea.

# Repo Splitting

The project is divided into three parts:

1. Package: A simple package on npm registry for plug and play
2. Website: The web-app, where an individual can manage his websites and its opacity.
3. Serverless Funcitons: Act as an endpoint that a website calls with it's API key to get the present opacity value.

# What does this project do

This project is a web-app that allows an individual to manage his websites and its opacity. It's an improved and web-based version of [Client Did Not Pay](https://github.com/kleampa/not-paid) js file. This project extends the mentioned repo's idea and gives complete credits of this creativity to the original inventors of this idea. You can find the flow diagram below:

![Flow Diagram](./public/flow-diagram.png)

# Tech Stack Used

- `Next.js`: For the web app (backend + frontend). Further framer motion and Tailwind CSS are used for animations and styling.
- `Drizzle ORM`: For the database management. (Supabase PostgresSQL)
- `Lambda Functions`: For the serverless functions that act as an endpoint for the websites to call.

# Schema and Database Table Format

To be updated after final push

# API Reference

To be updated after final push

# Project Structure

Project structure need to be update after final push

# Locally Running the project

To run the project locally, you need to have Node.js and npm installed on your machine. If you have it follow these steps:

1. There should be a `env` in the root of the `Website` folder, the schema of which is:

| Variable                        | Value                                          | Description                          |
| ------------------------------- | ---------------------------------------------- | ------------------------------------ |
| NODE_ENV                        | developement, production                       | The environment of the project       |
| SITE_NAME                       | PayFade                                        | The name of the project              |
| DOMAIN                          | localhost                                      | The domain of the project            |
| BASE_URL                        | http://localhost:3000                          | The base URL of the project          |
| NEXT_PUBLIC_BASE_URL            | http://localhost:3000                          | The base URL of the project          |
| DATABASE_URL                    | Database connection string                     | The database connection string       |
| G_ANALYTICS_ID                  | Google Analytics ID                            | The Google Analytics ID              |
| GOOGLE_CLIENT_ID                | Google Client ID                               | The Google Client ID                 |
| GOOGLE_CLIENT_SECRET            | Google Client Secret                           | The Google Client Secret             |
| NEXT_PUBLIC_GOOGLE_CLIENT_ID    | Google Client ID (same as above)               | The Google Client ID (same as above) |
| NEXT_PUBLIC_GOOGLE_REDIRECT_URI | http://localhost:3000/api/auth/callback/google | The Google Redirect URI              |
| GITHUB_CLIENT_ID                | Github Client ID                               | The Github Client ID                 |
| GITHUB_CLIENT_SECRET            | Github Client Secret                           | The Github Client Secret             |
| NEXT_PUBLIC_GITHUB_CLIENT_ID    | Github Client ID (same as above)               | The Github Client ID (same as above) |
| NEXT_PUBLIC_GITHUB_REDIRECT_URI | http://localhost:3000/api/auth/callback/github | The Github Redirect URI              |
| JWT_SECRET                      | JWT Secret                                     | The JWT Secret                       |

2. The database used is PostgresSQL by Supabase, so the code is written according to that. Perform a migration using command: `npx drizzle-kit push` before running the app.

3. Install the dependencies by running `npm install` in the `Website` folder.

4. Run the app using `npm run dev` in the `Website` folder.

5. To run lambda function, you need to deploy them in AWS account and do the API Gateway setup.

# Contribution

- All kinds of contributions are welcome.
- If you want to contribute, please open an issue first to discuss what you would like to change and then we will assign you the issue.

# License

This repo is under MIT license. You can use it for any purpose, but please give credits to the original authors of the idea.
