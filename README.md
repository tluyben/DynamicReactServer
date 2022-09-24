# React dynamic build server PoC

Simple demo how to dynamically compile react and serve the result 
via a node/express request. 
 
Made dynamic rendering of snippets in an iframe for another PoC.  

Note: this is a PoC and should not be used in production. If you don't know 
how this works, then do not run or try it. 

Update: read injection code from mongo

# Prereq:

- Linux or Mac cli (tested on both) 
- node 18 (see below)
- docker
- docker-compose

# First install

- Make sure you have Node >= 18

You can achieve this by running;

nvm install 18

- npm i yarn -g
- cd builder
- yarn
- copy env.test to .env for mongo 
- docker-compose -f docker-compose-mongo.yml up -d for mongo  
- ./setup

This will create two dirs; js-base, ts-base and fixes them so they can be used.

# There are 2 builders + a server;

run

- node index.js
 
to start the server. 

Currently the server will build using the data file in /tmp (linux/mac) which has 
been retrieved from mongo; run 

- ./setuptests

to create a test scenario for both js & ts; 

- http://127.0.0.1:3000/?id=632edf1baed096b6f8b677fb&lang=js
- http://127.0.0.1:3000/?id=632edf21aed096b6f8b67826&lang=ts

will show the results; put these urls in the iframe src=xxx and we are done. 


