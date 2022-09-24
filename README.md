# React dynamic build server PoC

Simple demo how to dynamically compile react and serve the result 
via a node/express request. 
 
Made dynamic rendering of snippets in an iframe for another PoC.  

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
- ./setup

This will create two dirs; js-base, ts-base and fixes them so they can be used.

# There are 2 builders + a server;

run

- node index.js
 
to start the server. 

Currently the server will build using the data file in /tmp (linux/mac); run 

- ./setuptests

to create a test scenario for both js & ts; 

- http://127.0.0.1:3000/?id=test1&lang=js
- http://127.0.0.1:3000/?id=test2&lang=ts

will show the results; put these urls in the iframe src=xxx and we are done. 


