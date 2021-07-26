# Allez - Orbital 2021

[![CircleCI](https://circleci.com/gh/yeppog/allez.svg?style=shield&circle-token=0a05dd5ab7ba277eb1270303c3ed9d3d01d085f2)](https://circleci.com/gh/yeppog/allez/tree/master)
[![codecov](https://codecov.io/gh/yeppog/allez/branch/master/graph/badge.svg?token=XDZE7C6VCM)](https://codecov.io/gh/yeppog/allez)

Proposed Level of Achievement: Apollo 11

## Motivation

Imagine you&#39;re stuck on a route while climbing and you are not sure how to proceed. Nobody around you knows how to do it either. You want to have someone show you how to do the route i.e show you the beta (guide for the movement sequence to get through the problems) but you can&#39;t find the any videos online.

There are indeed many climbing Instagram pages online that have climbers post videos of them climbing the route and they may have the beta that you are looking for, but it is messy, unorganised, and often hard to find especially if you don&#39;t follow these pages. To solve this, **Allez** eliminates the hassle of looking through Instagram tirelessly, through building a social media beta-sharing platform solely for the purpose of rock climbing sharing.

![](static/betamonkeys107.png)

## Aim

We hope to be able to categorise routes and betas efficiently such that users are able to search for them quickly. We also hope to allow climbing gyms to have a special account such that they can manage their routes, as well as upload the intended beta (solution).

## User Stories

1. As a climber who is stuck on a route, I would be able to quickly look up the solution of the current route that I am on efficiently.
2. As a professional climber who knows how to solve this route, I would be able to upload and share videos of me completing the route to help others.
3. As an owner of a rock climbing gym, I would be able to publish my route rotations for the week, as well as upload the intended betas for routes so my customers have a guide of how to do the problem.
4. As a user of any sort, I would be able to share and discuss solutions to these routes on the platform and interact with other users.
5. As a user of any sort, I want to be able to post my thoughts and feed where others in my network can comment on.
6. As a user of any sort, I want to be able to follow and receive updates on people/gyms that I am interested in hearing from.
7. As a user of any sort, I want to be able to easily upload a climbing route to share with people.

## Features and Timeline

We aim to create a **web-based social media site** which provides a place for climbers to share their betas (solutions) to climbing problems for climbers to see and learn.

This acts as a customised and targeted social media platform that climbers can use to quickly search up solutions and share their own personal solutions.

Gyms can submit their own routes and there can be community submitted routes as well.

When creating routes, users submit an image of the route which is processed our backend which will be trained by machine learning to allow users to select and label the holds (start, end, footholds, etc). This makes it much easier for a user to submit a route.

Users will be able look through posts sorted by the routes that they are interested in and submit their betas under a route or create their own.

<img src="static/segment.jpeg" alt="drawing" style="width:500px;"/>

Example of how a wall might be segmented to allow users to select their routes.
Source: Stōkt https://www.getstokt.com/

## Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/1b060d01-2db2-4025-8133-3eeee2982701/deploy-status)](https://app.netlify.com/sites/allez-orbital/deploys)

The project can be accessed from the following links

Frontend: <https://allez-orbital.netlify.app/>

Backend: <https://allez-orbital.herokuapp.com/>

**Features:**

1. **Account Registration and Log in**

   - Users can register their account with their details and log in to the website

   ![](static/Login.png)

   ![](static/Register.png)

2. **Homepage Feed of following posts**

- Feed of posts of climbers or gyms that the user follows which will constantly be updated when someone followed posted a new post

![](static/Feed.png)

3. **Posting of Video or Photos**

   - Users can share videos or photos of them attempting and completing climbing routes

   ![](static/CreatePost.png)

4. **Post-editing and Deletion**

   - Users can edit and delete posts that the user have created.

   <img src="static/EditDelete.png" alt="drawing" style="width:300px;"/>

   **Editing**

   <img src="static/Edit.png" alt="drawing" style="width:300px;"/>

   **Deleting**

   <img src="static/Delete.png" alt="drawing" style="width:300px;"/>

5. **Profile editing**

   - Users can edit key information on the user's profile such as their profile picture, bio, username and password

   ![](static/EditProfile.png)

6. **Searching for Users, Gyms, Routes**

   - Users can find User and Gym pages, and browse routes based on tags
   - Users can view posts of other users and posts that are tagged to a gym

   ![](static/Search.png)

**Uncompleted**

Due to insufficient time to collect data for and train the machine learning model the following features were not completed in time for milestone 3

7.  **Machine learning to identify route holds for easier route creation**

8.  **Route tagging**

**Timeline**

![](static/Timeline.png)

## **Software Engineering Practises**

### Project Management with Notion

Notion is used as it as our one stop location for any information related to the project besides that it also helps us see the work we have currently to do and allocate it to various people to be completed.

![](static/Notion.png)

### Version Control with Git

Git is used as the version control of choice with Github as the hosting site.

![](static/Github1.png)

In addition to committing our changes to github we also use the github issues page to keep track of enhancements and bugs that our project has.

![](static/Github2.png)

### Usage of CI to Test Code

Our project also uses `Jest` together with `CircleCI` to run code on every push to Github to ensure that the code pushed passes unit testing that is written. As of now, only the backend is covered by unit tests. The CI tests can be seen below:

![](static/circleci.jpeg)

The tests are run and the coverage report by Jest is automatically uploaded to `CodeCov`

![](static/circleresults.jpeg)

![](static/codecov.jpeg)

Codecov helps us keep track of the project's test coverage and let's us know when we need to add more tests. Currently the coverage is low and we aim to increase the coverage by Milestone 3.

### Usage of Deployment Tools

We currently use `Heroku` and `Netlify` to host our code, and `Vercel` to deploy per push as Vercel has unlimited deployments. Vercel allows us to test our compiled code every `push` online.

## Design

This section will cover the design of the app in brief detail.

### Backend

The backend is run using `Node.js`, `Express.js` and `MongoDB`. We store schemas for the following objects:

1. User
2. Gym
3. Images
4. Post
5. Route
6. User
7. Video

Each of these schemas have their own document shape that the object will conform to, which allows us to query the data.

For Image and Video uploads, we use `GridFS` with `multer` as a storage engine, to split the files up into chunks on `MongoDB`, then stream it.

**New in Milestone 3!**

The backend has also moved to a typescript based server to provide better error handling and prevent unforseen type errors that can be caught at compile time.

We added validators to help control the flow of the HTTP requests to automatically handle errenous request quickly and easily, all while mainting cleaner code.

We also included a logger to help log the requests that have been proccessed on the server.

## Class Diagram

![](static/ObjectDiagram.png)

## Activity Diagram

![](static/ActivityDiagram.jpg)

## Getting Started

1. Clone this repository by running `git clone`.

2. `cd` into `client` and `server` and run the command `npm start`.
