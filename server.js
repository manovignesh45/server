const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const corsOptions = require('./config/corsOptions')
const {logger} = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const verifyJWT = require('./middleware/verifyJWT')
const cookieParser = require('cookie-parser');
const PORT = process.env.PORT || 3000;
const fs = require('fs');

// Custom middleware logger
app.use(logger);

// Cross Origin Resource Sharing
// Third party Middleware
app.use(cors(corsOptions));

// build-in middleware to handle urlncoded data (form-data)
app.use(express.urlencoded({extended: false}));

// Build-in middleware for json
app.use(express.json());

//middelware for cookies
app.use(cookieParser());

// Serve static file 
app.use('/', express.static(path.join(__dirname, '/public')));
app.use('/subdir', express.static(path.join(__dirname, '/public')));

//routes
app.use('/', require('./routes/root'));
app.use('/register', require('./routes/register'));
app.use('/auth', require('./routes/auth'));
app.use('/refresh', require('./routes/refresh'));
app.use('/logout', require('./routes/logout'));
app.use('/subdir', require('./routes/subdir'));

app.use(verifyJWT);
app.use('/employees', require('./routes/api/employees'));

// app.get('/*', (req, res) => {  // *- for all
//   const fileExist = fs.existsSync(path.join(__dirname, req.url));
//   if(fileExist) {
//   res.sendFile(path.join(__dirname, req.url));
//   }
//   res.status(404).sendFile(path.join(__dirname, 'views', '404.html'))
// })

app.all('*', (req, res) => {
  res.status(404);
  if(req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'))
  } else if(req.accepts('json')) {
    res.json({error: '404 Not found'});
  } else {
    res.type('txt').send('404 Not found');
    }
  }
);

//custom error handler
app.use(errorHandler);

app.listen(PORT, console.log(`Server running at PORT ${PORT}`));