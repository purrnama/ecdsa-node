## ECDSA Node

### Purrnama's notes

Heyya, this is my implementation of public key signatures for Week 1 Project in Alchemy University Ethereum Developer Bootcamp. I will be describing my implementation here in brief.

#### Ethereum style public addresses

Continuing from the video, I've formatted the public addresses to follow the Ethereum style of formatting, using the last 20 digits of the keccak hash.

#### Connect wallet using signature

`generate.js` in server will output a connect signature that will be used to find the public key when interacting with the client. For simplicity sake, the recovery bit is concatenated with the hex signature. The server will then slice them back, convert the hex signature back into Uint8Array and run the `recoverPublicKey` function to find the respective public address.

### ECDSA Node continued

This project is an example of using a client and server to facilitate transfers between different addresses. Since there is just a single server on the back-end handling transfers, this is clearly very centralized. We won't worry about distributed consensus for this project.

However, something that we would like to incoporate is Public Key Cryptography. By using Elliptic Curve Digital Signatures we can make it so the server only allows transfers that have been signed for by the person who owns the associated address.

### Video instructions

For an overview of this project as well as getting started instructions, check out the following video:

https://www.loom.com/share/0d3c74890b8e44a5918c4cacb3f646c4

### Client

The client folder contains a [react app](https://reactjs.org/) using [vite](https://vitejs.dev/). To get started, follow these steps:

1. Open up a terminal in the `/client` folder
2. Run `npm install` to install all the depedencies
3. Run `npm run dev` to start the application
4. Now you should be able to visit the app at http://127.0.0.1:5173/

### Server

The server folder contains a node.js server using [express](https://expressjs.com/). To run the server, follow these steps:

1. Open a terminal within the `/server` folder
2. Run `npm install` to install all the depedencies
3. Run `node index` to start the server

The application should connect to the default server port (3042) automatically!

_Hint_ - Use [nodemon](https://www.npmjs.com/package/nodemon) instead of `node` to automatically restart the server on any changes.
