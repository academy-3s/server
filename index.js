const express = require("express");

const morgan = require("morgan");
//const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const multer = require('multer');
//const path = require('path');
const xlsx = require('xlsx');
//const https = require('https');
//const fs = require('fs');
const routes = require('./routes.js');
const helmet = require('helmet')
const nodeCCAvenue = require('node-ccavenue');

require('dotenv').config();

// Require routes Folder
const userRouter = require("./routes/user");
const courseRoutes = require("./routes/courseRoutes");
const documentRoutes = require('./routes/documentRoutes');
const categoryRoutes = require("./routes/categories")
const contactController = require('./controllers/contactController');
const contactRoutes = require('./routes/contactRoutes');
const questionRoutes = require('./routes/questionRoutes');
const RealTestRoutes = require('./routes/RealTestRoutes');
// const paymentRoutes = require('./routes/paymentRoutes');
const studentRoutes = require('./routes/studentRoutes')
const paymentRoutes = require('./routes/paymentRoutes');
const certificateRoutes = require("./routes/certificateRoutes");
const certificateContactController = require("./controllers/certificateContactController")
const orderController = require("./controllers/orderController")
const indexRoutes = require('./routes');
const certificate = require('./routes/certificate');
const orderRoutes = require('./routes/orderRoutes');


const app = express();



// Middlewares
app.use(morgan('dev'));
// app.use(
//   helmet({
//     referrerPolicy: {
//       policy: "no-referrer",
//     },
//   })
// );
// app.use(bodyParser.urlencoded({ extended: true }));
// app.use(bodyParser.json());

app.use(morgan("dev"));
app.use(cors());
//app.use(bodyParser.urlencoded({ extended: true }));
//app.use(bodyParser.json());
// app.use('/', routes);

// DataBase Connection
mongoose
  .connect(process.env.DB, {
    useNewUrlParser: true,
  })
  .then(() => console.log("DataBase connection successful"))
  .catch((err) => console.log(err));

// api
app.use(express.json());
app.get("/meet", (req, res) => {
  res.redirect("http://localhost:3000/profile")
})
app.use("/api/users", userRouter);
app.use("/api/courses", courseRoutes);
app.use('/api', documentRoutes);
app.use('/api/contact', contactRoutes);
app.use('/category', categoryRoutes);
app.use('/questions', questionRoutes);
app.use('/RealTestquestions', RealTestRoutes);
// app.use('/', paymentRoutes);
app.use("/api/student", studentRoutes);
app.use('/payment', paymentRoutes);
app.use('/certificate', certificateRoutes)
app.use('/', indexRoutes);
app.use('/certificates', certificate);
app.use('/orders', orderRoutes);
// making this comment for a change in the git commit's


// Set up the static uploads directory
app.use(express.static('uploads'));
app.use(express.static('certificates'))

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const fileName = `${file.fieldname}-${Date.now()}${ext}`;
    cb(null, fileName);
  }
});
const upload = multer({ storage });

// Serve static files 2
app.use(express.static('pdfs'));
app.use(express.static(__dirname + '/'));


app.get('/a', (req, res) => {
  res.send("chill it's working")
})


const path = require('path');
var https = require('https');
// const https = require('https');

// var express = require('express');
// //var app = express();
var http = require('http'),
  fs = require('fs'),
  ccav = require('./ccavutil.js'),
  qs = require('querystring'),
  ccavReqHandler = require('./ccavRequestHandler.js'),
  ccavResHandler = require('./ccavResponseHandler.js');
const { enrollInCourse } = require("./controllers/courseController.js");

app.use(express.static('public'));
app.set('views', __dirname + '/public');
app.engine('html', require('ejs').renderFile);

app.get('/', (req, res) => {
  res.send("working")
})
app.get('/about', function (req, res) {
  res.render('dataFrom.html');
});

// only need 3 api's to do our work
app.post('/ccavRequestHandler', function (request, response) {
  ccavReqHandler.postReq(request, response);
});

app.post("/payment/success", (request, response) => {
  var ccavEncResponse = '',
    ccavResponse = '',
    ccavPOST = '';
  const ccav = new nodeCCAvenue.Configure({
    merchant_id: process.env.MERCHANTID,
    working_key: process.env.WORKINGKEY,
  });
  request.on('data', async function (data) {
    ccavEncResponse += data;
    // console.log("req.body /payment/success", ccavEncResponse, typeof ccavEncResponse) // whole encrypted response
    ccavPOST = qs.parse(ccavEncResponse);
    // console.log("ccavPOST", ccavPOST, typeof ccavPOST) // encrypted res converted to object
    var encryption = ccavPOST.encResp;
    // console.log("encryption", encryption, typeof encryption) // only data of ccavenue encrypted
    var ccavResponse = ccav.redirectResponseToJson(encryption); // object contaning all the values
    // console.log("ccavResponse", ccavResponse, typeof ccavResponse)
    const userId = ccavResponse.merchant_param1;
    const courseIds = ccavResponse.merchant_param2.split(",");
    // // console.log("courseId", courseIds);
    if (ccavResponse.order_status === "Success") {
      try {
        const orderHistoryData = {
          user: userId,
          courses: courseIds,
          orderId: ccavResponse.order_id,
          totalCartValue: ccavResponse.amount,
          payment_type: ccavResponse.payment_mode,
          billing_name: ccavResponse.billing_name,
          billing_email: ccavResponse.billing_email,
          billing_phone: ccavResponse.billing_tel,
          billing_address: ccavResponse.billing_address,
          billing_zip: ccavResponse.billing_zip,
          billing_city: ccavResponse.billing_city,
          billing_state: ccavResponse.billing_state,
          billing_country: ccavResponse.billing_country,
        }
        const order = await orderController.createOrder(orderHistoryData)
        let result
        if (order.status === true) {
          result = await enrollInCourse(userId, courseIds, order.orderId);
        }
        // console.log("result", result);
        if (result === true) {
          // const orderHistoryData = {
          //   user: userId,
          //   courses: courseIds,
          //   orderId: ccavResponse.order_id,
          //   totalCartValue: ccavResponse.amount,
          //   payment_type: ccavResponse.payment_mode,
          //   billing_name: ccavResponse.billing_name,
          //   billing_email: ccavResponse.billing_email,
          //   billing_phone: ccavResponse.billing_tel,
          //   billing_address: ccavResponse.billing_address,
          //   billing_zip: ccavResponse.billing_zip,
          //   billing_city: ccavResponse.billing_city,
          //   billing_state: ccavResponse.billing_state,
          //   billing_country: ccavResponse.billing_country,
          // }
          // send email on successful purchase to the billing email
          certificateContactController.sendWhenCoursePurchased(ccavResponse.billing_name, ccavResponse.billing_email, courseIds);
          // create order history in our database
          // orderController.createOrder(orderHistoryData)
          response.redirect("https://www.academy3s.com/success");
        }
      } catch (error) {
        console.error("Error enrolling in course:", error);
        response.redirect("https://www.academy3s.com/failure");
      }
    } else {
      response.redirect("https://www.academy3s.com/failure");
    }
  });
  // console.log("ccavResponse", ccavResponse)
  // ccavResHandler.postRes(
  //   request,
  //   response,
  //   async function (error, ccavResponse) {
  //     if (error) {
  //       // Handle error
  //       console.error("Error:", error);
  //       response.writeHead(500, { "Content-Type": "text/plain" });
  //       response.end("Internal Server Error");
  //       return;
  //     }

  //     // Now you have access to ccavResponse here 1
  //     // // console.log(
  //     //   "ccavResponse in index.js:",
  //     //   ccavResponse,
  //     //   typeof ccavResponse
  //     // );

  //     const parsedData = new URLSearchParams(ccavResponse);

  //     // Convert the parsed data into a plain object
  //     const ccavResponseObject = {};
  //     parsedData.forEach((value, key) => {
  //       ccavResponseObject[key] = value;
  //     });
  //     // // console.log(
  //     //   "ccavResponseObject",
  //     //   ccavResponseObject,
  //     //   ccavResponseObject.merchant_param1,
  //     //   typeof ccavResponseObject.merchant_param1
  //     // );
  //     const userId = ccavResponseObject.merchant_param2;
  //     const courseIds = ccavResponseObject.merchant_param1.split(",");
  //     // // console.log("courseId", courseIds);
  //     if (ccavResponseObject.order_status === "Success") {
  //       try {
  //         const result = await enrollInCourse(userId, courseIds);
  //         // console.log("result", result);
  //         if (result === 200) {
  //           response.redirect("https://www.academy3s.com/success");
  //         }
  //       } catch (error) {
  //         console.error("Error enrolling in course:", error);
  //         response.redirect("https://www.academy3s.com/failure");
  //       }
  //     } else {
  //       response.redirect("https://www.academy3s.com/failure");
  //     }
  //   }
  // );
});

app.post("/payment/failure", (req, res) => {
  res.redirect("https://www.academy3s.com/failure");
});

// app.listen(process.env.PORT, 'www.academy3s.com', () => {
//   // console.log("Server is listening on port ", process.env.PORT);
// });

const sslServer = https.createServer(
  {
    key: fs.readFileSync(path.join(__dirname, 'privkey.pem')), // key
    cert: fs.readFileSync(path.join(__dirname, 'fullchain.pem')), //certificate
  },
  app
)
sslServer.listen(5000, () => console.log('Secure server on port 5000'))