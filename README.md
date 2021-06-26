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

A **web-based social media site** which provides a place for climbers to share their betas (solutions) to climbing problems for climbers to see and learn.

This acts as a customised and targeted social media platform that climbers can use to quickly search up solutions and share their own personal solutions.

Gyms can submit their own routes and there can be community submitted routes as well.

When creating routes, users submit an image of the route which is processed our backend which will be trained by machine learning to allow users to select and label the holds (start, end, footholds, etc). This makes it much easier for a user to submit a route.

Users will be able look through posts sorted by the routes that they are interested in and submit their betas under a route or create their own.

<img src="static/segment.jpeg" alt="drawing" style="width:500px;"/>

Example of how a wall might be segmented to allow users to select their routes.
Source: Stōkt https://www.getstokt.com/



To be completed by the mid of June:

**Features:**

1. **Posting of Video or Photos**
    - Ability to share videos or photos of them attempting and completing climbing routes
2. **Homepage Feed of following posts**
    - Feed of posts of climbers or gyms that the user follows which will constantly be updated when someone followed posted a new post
3. **Post-editing and Deletion**
    - Ability to edit and delete posts that the user have created.
4. **Profile editing**
    - Ability to edit key information on the user's profile such as their profile picture, bio, username and password
    - Ability to arrange post seen by others users on their profile
5. **Searching for Users, Gyms, Routes**
    - Ability to find User and Gym pages, and browse routes based on tags
    - Ability to view posts of other users and posts that are tagged to a gym

**Documentation:**

1. **API Routes**
    - Using SwaggerUI and OpenAPI to document API routes
    - API Documentation to be accessible at root of server domain
    - API Documentation to include response and request schemas and endpoints
2. **JS Docs for functions**
    - Documentation to be included for the implementer to know the purpose of the function, and what parameters each function take
    - To be done in both client and server respectively
3. **User Documentation**
    - Documentation on how to use the system will be included
4. **Developer Documentation**
    - API documentation from point (1)
    - Update class diagrams (to account for new fields and classes)
    - Add activity diagram
5. **Readme**
    - Clarify meanings of climbing related jargon
    - Update user stories to make the usage of the application clearer
    - Update timeline to reflect current progress

**Testing:**

1. CircleCI integration with Jest
    - Automated testing on push to Github to run jest test files
    - Test both frontend (React) and backend (Node Express Mongo) code
2. Codecov Integration
    - Code coverage report to be generated to check for the coverage of test files
    - Used as a gauge of test effectiveness
    ****

To be completed by the mid of July:

1. Implementation of video uploads (optimisation, compression)
2. Social network to be implement (user relations, followers, etc)
3. Frontend main features to be completed (posting, liking, commenting, submission of routes, tags)
4. Shape detection algorithm to identify route holds for easier route creation.

## Class Diagram

![](static/ObjectDiagram.png)


## Activity Diagram

![](static/ActivityDiagram.jpg)

## Deployment

[![Netlify Status](https://api.netlify.com/api/v1/badges/1b060d01-2db2-4025-8133-3eeee2982701/deploy-status)](https://app.netlify.com/sites/allez-orbital/deploys)

The project can be accessed from the following links

Frontend: <https://allez-orbital.netlify.app/>

Backend: <https://allez-orbital.herokuapp.com/>

## Getting Started

1. Clone this repository by running `git clone`.

2. `cd` into `client` and `server` and run the command `npm start`.
