const express = require('express');
const bodyParser = require("body-parser");
const axios = require("axios"); // Import 'axios' instead of 'request'
const moment = require("moment");
const apiRouter = require('./api');
const cors = require("cors");
// Create an Express application
const app = express();
app.use(express.json());
app.use(cors()); // Enable CORS for all routes

// Define a route
app.get('/', (req, res) => {
  res.send('Hello, Express!');
});

// Set up a server to listen on port 3000
const port = 3000;
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

const friends=["254740616615","254792434244", "254743466032"]

//====================================ESENPI==============================================
async function getAccessToken(cK,cS) {
    // REPLACE IT WITH YOUR CONSUMER SECRET
 const url =
      "https://api.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials";
  
    const auth =
      "Basic " +
      new Buffer.from(cK + ":" + cS).toString("base64");
  
    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: auth,
        },
      });
      const accessToken = response.data.access_token;
      return accessToken;
    } catch (error) {
      throw error;
    }
  }
  
  app.get("/", (req, res) => {
    res.send("MPESA DARAJA API WITH NODE JS BY UMESKIA SOFTWARES");
    var timeStamp = moment().format("YYYYMMDDHHmmss");
    console.log(timeStamp);
  });
  
  //ACCESS TOKEN ROUTE
  app.get("/access_token", (req, res) => {
    const consumer_key = "ogNIHgP7LRN2LjGuKb7ShvCGM6xUHuKubEiiGnmddnNwl7CF"; // REPLACE IT WITH YOUR CONSUMER KEY
    const consumer_secret = "blg5AHGBAYzV40oJwfeR9pwByUlQb4nj055x8DfwAJzspOq1bRSlaQafuAkgYB5A"; // REPLACE IT WITH YOUR CONSUMER SECRET
   
    getAccessToken(consumer_key,consumer_secret)
      .then((accessToken) => {
        res.send("😀 Your access token is " + accessToken);
      })
      .catch(console.log);
  });
  
  //MPESA STK PUSH ROUTE
  app.post("/stkpush", (req, res) => {
    //=============REQUEST DATA=============
    const consumer_key = "ogNIHgP7LRN2LjGuKb7ShvCGM6xUHuKubEiiGnmddnNwl7CF"; // REPLACE IT WITH YOUR CONSUMER KEY
    const consumer_secret = "blg5AHGBAYzV40oJwfeR9pwByUlQb4nj055x8DfwAJzspOq1bRSlaQafuAkgYB5A"; // REPLACE IT WITH YOUR CONSUMER SECRET
   
    console.log(req.body);
    const r=req.body;
    const amount=r.amount
    const customer=r.customerMSISDN
    //=============REQUEST DATA=============
    getAccessToken(consumer_key,consumer_secret)
    .then((accessToken) => {
      const url =
        "https://api.safaricom.co.ke/mpesa/stkpush/v1/processrequest";
      const auth = "Bearer " + accessToken;
      const timestamp = moment().format("YYYYMMDDHHmmss");
      const password = new Buffer.from(
        "6723519" +
          "d61bb261124f727cfad44a8a00708452d517ba453519926f06c102abc298a44f" +
          timestamp
      ).toString("base64");

  
        axios
          .post(
            url,
            {
              BusinessShortCode: "6723519",
              Password: password,
              Timestamp: timestamp,
              TransactionType: "CustomerBuyGoodsOnline",
              Amount: amount,
              PartyA: `254${customer}`,
              PartyB: "4123906",
              PhoneNumber: `254${customer}`,
              CallBackURL: "https://esenpi.onrender.com/callback/",
              AccountReference: "Esenpi",
              TransactionDesc: "Mpesa Daraja API stk push test",
            },
            {
              headers: {
                Authorization: auth,
              },
            }
          )
          .then((response) => {
            res.send("😀 Request is successful done ✔✔. Please enter mpesa pin to complete the transaction");
            console.log(response);
        })
          .catch((error) => {
            console.log(error);
            res.status(500).send("❌ Request failed");
          });
      })
      .catch(console.log);
  
});
  
  // REGISTER URL FOR C2B
  app.get("/registerurl", (req, resp) => {
    const consumer_key = "ogNIHgP7LRN2LjGuKb7ShvCGM6xUHuKubEiiGnmddnNwl7CF"; // REPLACE IT WITH YOUR CONSUMER KEY
    const consumer_secret = "blg5AHGBAYzV40oJwfeR9pwByUlQb4nj055x8DfwAJzspOq1bRSlaQafuAkgYB5A"; // REPLACE IT WITH YOUR CONSUMER SECRET
   
    getAccessToken(consumer_key,consumer_secret)
      .then((accessToken) => {
        const url = "https://api.safaricom.co.ke/mpesa/c2b/v1/registerurl";
        const auth = "Bearer " + accessToken;
        axios
          .post(
            url,
            {
              ShortCode: "6723519",
              ResponseType: "Complete",
              ConfirmationURL: "http://192.168.43.178/confirmation",
              ValidationURL: "http://192.168.43.178/validation",
            },
            {
              headers: {
                Authorization: auth,
              },
            }
          )
          .then((response) => {
            resp.status(200).json(response.data);
          })
          .catch((error) => {
            console.log(error);
            resp.status(500).send("❌ Request failed");
          });
      })
      .catch(console.log);
  });
  
  app.get("/confirmation", (req, res) => {
    console.log("All transaction will be sent to this URL");
    console.log(req.body);
  });
  
  app.get("/validation", (req, resp) => {
    console.log("Validating payment");
    console.log(req.body);
  });
  app.get("/callback", (req, resp) => {
    console.log("Validating payment");
    console.log(req.body);
  });
  
  // B2C ROUTE OR AUTO WITHDRAWAL
  app.get("/b2curlrequest", (req, res) => {
    getAccessToken()
      .then((accessToken) => {
        const securityCredential =
          "N3Lx/hisedzPLxhDMDx80IcioaSO7eaFuMC52Uts4ixvQ/Fhg5LFVWJ3FhamKur/bmbFDHiUJ2KwqVeOlSClDK4nCbRIfrqJ+jQZsWqrXcMd0o3B2ehRIBxExNL9rqouKUKuYyKtTEEKggWPgg81oPhxQ8qTSDMROLoDhiVCKR6y77lnHZ0NU83KRU4xNPy0hRcGsITxzRWPz3Ag+qu/j7SVQ0s3FM5KqHdN2UnqJjX7c0rHhGZGsNuqqQFnoHrshp34ac/u/bWmrApUwL3sdP7rOrb0nWasP7wRSCP6mAmWAJ43qWeeocqrz68TlPDIlkPYAT5d9QlHJbHHKsa1NA==";
        const url = "https://sandbox.safaricom.co.ke/mpesa/b2c/v1/paymentrequest";
        const auth = "Bearer " + accessToken;
        axios
          .post(
            url,
            {
              InitiatorName: "testapi",
              SecurityCredential: securityCredential,
              CommandID: "PromotionPayment",
              Amount: "1",
              PartyA: "600996",
              PartyB: "254768168060",
              Remarks: "Withdrawal",
              QueueTimeOutURL: "https://mydomain.com/b2c/queue",
              ResultURL: "https://mydomain.com/b2c/result",
              Occasion: "Withdrawal",
            },
            {
              headers: {
                Authorization: auth,
              },
            }
          )
          .then((response) => {
            res.status(200).json(response.data);
          })
          .catch((error) => {
            console.log(error);
            res.status(500).send("❌ Request failed");
          });
      })
      .catch(console.log);
  });