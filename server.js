const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql2');
const multer = require('multer');
const fs = require('fs');
const nodemailer = require('nodemailer');


const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const path = require('path');  

require('dotenv').config(); 

const app = express();
const PORT = process.env.PORT || 5000; 
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json());


// Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST || 'localhost',
  user: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || '1234',
  database: process.env.DB_NAME || 'fruit',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to the MySQL database.');
});


const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const extname = path.extname(file.originalname);
    cb(null, `${Date.now()}${extname}`);
  },
});

const upload = multer({ storage });


const JWT_SECRET = process.env.JWT_SECRET || 'local-dev-secret'; // Fallback for local testing



// Helper function to authenticate token
const authenticateToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1]; // Bearer <token>
  if (!token) return res.status(401).json({ error: 'Access denied. No token provided.' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid token.' });
    req.user = user; 
    next();
  });
};

app.get('/data', (req, res) => {
  const sql = 'SELECT id, name, email, message,contact FROM contact where status=1';
 

  db.query(sql, (err, rows) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (rows.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }
    console.log(rows)

    res.json(rows);
  });
});

app.post('/submit', (req, res) => {
  const { name, email, message,contact} = req.body;

  if (!name || !email || !message || !contact) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const sql = 'INSERT INTO contact (name, email, message,contact) VALUES (?, ?, ?, ?)';
  db.query(sql, [name, email, message,contact], (err, result) => {
    if (err) {
      console.error('Failed to insert data:', err);
      return res.status(500).json({ error: 'Failed to save data.' });
    }
    res.status(200).json({ success: 'Message submitted successfully.' });
  });
});

app.delete('/delete/:id', (req, res) => {
  const id = req.params.id;
  const sql = 'UPDATE contact SET status = 0 WHERE id = ?';

  db.query(sql, [id], (err, result) => {
    if (err) {
      console.error('Error updating record status:', err);
      return res.status(500).json({ error: 'Failed to update record status' });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'No record found with the given ID' });
    }

    res.status(200).json({ message: 'Record status updated successfully to inactive' });
  });
});

app.post('/signup', async (req, res) => {
  const { firstname, lastname, email, password } = req.body;

  if (!firstname || !lastname || !email || !password) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  const checkEmailQuery = 'SELECT * FROM signup WHERE email = ?';
  db.query(checkEmailQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error checking email:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'Email is already registered.' });
    }

    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const sql = 'INSERT INTO signup (firstname, lastname, email, password) VALUES (?, ?, ?, ?)';
      db.query(sql, [firstname, lastname, email, hashedPassword], (err, result) => {
        if (err) {
          console.error('Error inserting user:', err);
          return res.status(500).json({ error: 'Failed to register user.' });
        }

        const token = jwt.sign({ id: result.insertId, email: email }, JWT_SECRET, { expiresIn: '1h' });
        res.status(201).json({ token });
      });
    } catch (error) {
      console.error('Error hashing password:', error);
      return res.status(500).json({ error: 'Failed to hash password.' });
    }
  });
});

app.post('/login', (req, res) => {
  const { email, password } = req.body;

  const sql = 'SELECT id, firstname, lastname, email, password FROM signup WHERE email = ?';
  db.query(sql, [email], async (err, results) => {
    if (err) {
      console.error('Error fetching user from database:', err);
      return res.status(500).json({ error: 'Failed to authenticate user.' });
    }

    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const user = results[0];
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(400).json({ error: 'Incorrect password.' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        email: user.email,
      },
    });
  });
});


app.get('/account', authenticateToken, (req, res) => {
  const sql = 'SELECT id, firstname, lastname, email FROM signup WHERE id = ?';
  db.query(sql, [req.user.id], (err, results) => {
    if (err) {
      console.error('Error fetching account details:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }
    if (results.length === 0) {
      return res.status(404).json({ error: 'User not found.' });
    }
    res.status(200).json(results[0]);
  });
});


app.put('/update-account', authenticateToken, (req, res) => {
  const { firstname, lastname, email} = req.body;

  const sql = 'UPDATE signup SET firstname = ?, lastname = ?, email = ? WHERE id = ?';
  db.query(sql, [firstname, lastname, email, req.user.id], (err, result) => {
    if (err) {
      console.error('Error updating account:', err);
      return res.status(500).json({ error: 'Failed to update account.' });
    }

    res.status(200).json({ success: 'Account updated successfully.' });
  });
});

app.get('/signupdata', (req, res) => { 
  const fetchAllQuery = 'SELECT * FROM signup';
    db.query(fetchAllQuery, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      return res.status(500).json({ error: 'Internal Server Error' });
    }

    if (results.length === 0) {
      return res.status(404).json({ message: 'No data found' });
    }

    res.status(200).json({
      success: true,
      data: results
    });
  });
});






app.post('/add_order', async (req, res) => {
  const { firstname, lastname, address, town, postcode, mobile, email, delivery_date, cart_items } = req.body;

  // Insert order into the 'placed' table
  const query = `INSERT INTO placed_order (firstname, lastname, address, town, postcode, mobile, email, delivery_date, cart_items) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  db.execute(query, [firstname, lastname, address, town, postcode, mobile, email, delivery_date, JSON.stringify(cart_items)], (err, result) => {
    if (err) {
      console.error("Error inserting order:", err);
      return res.status(500).json({ message: "Failed to place order" });
    }
    res.status(200).json({ message: "Order placed successfully!" });
  });
});
app.get('/get-orders', async (req, res) => {
  const { email } = req.query;  // Get email from query parameters

  if (!email) {
    return res.status(400).json({ error: "Email is required." });
  }

  const query = "SELECT * FROM placed_order WHERE email = ?";
  db.execute(query, [email], (err, result) => {
    if (err) {
      console.error("Error fetching orders:", err);
      return res.status(500).json({ error: "Failed to fetch orders." });
    }
    res.status(200).json(result);  
  });
});
app.get('/placedorders', (req, res) => {
  const query = 'SELECT * FROM placed_order'; 

  db.query(query, (err, result) => {
    if (err) {
      console.error('Error querying placedorders:', err);
      return res.status(500).json({ success: false, message: 'Failed to fetch placed orders' });
    }
    console.log('Fetched placed orders:', result);  
    res.status(200).json({ success: true, data: result });
  });
});


app.delete("/delete-account", (req, res) => {
  const { email } = req.body;

  if (!email) {
    console.log("Missing email in request body.");
    return res.status(400).json({ error: "Email is required." });
  }

  console.log("Email received:", email);

  db.query(
    "DELETE FROM signup WHERE email = ?",
    [email],
    (error, results) => {
      if (error) {
        console.error("SQL Error:", error.sqlMessage || error);
        return res.status(500).json({ error: "Database error during deletion." });
      }

      console.log("Query Results:", results);

      if (results.affectedRows === 0) {
        console.log("User not found for email:", email);
        return res.status(404).json({ error: "User not found." });
      }

      console.log("User deleted successfully for email:", email);
      res.status(200).json({ message: "Account deleted successfully." });
    }
  );
});
app.put('/update-deli', (req, res) => {
  const { status, id } = req.body;  

  
  if (status !== 'Delivered') {
    return res.status(400).json({ message: 'Only "Delivered" status can be updated.' });
  }

  const sql = 'UPDATE placed_order SET status = ? WHERE id = ? AND status != "Delivered"';

  db.query(sql, [status, id], (err, result) => {
    if (err) {
      console.error('Error updating order status:', err);
      return res.status(500).json({ error: 'Failed to update order status.' });
    }

    if (result.affectedRows === 0) {
      return res.status(400).json({ message: 'The order was not found or its status is already Delivered.' });
    }

    // Respond with success if the status is updated
    res.status(200).json({ success: 'Order status updated successfully to Delivered.' });
  });
});
app.post("/cancel-order", (req, res) => {
  const { orderId } = req.body;

  
  const query = 'UPDATE placed_order SET status = "Cancelled" WHERE id = ?';

  db.execute(query, [orderId], (err, results) => {
    if (err) {
      console.error('Error updating order:', err);
      return res.status(500).json({ error: "Failed to cancel order." });
    }

    if (results.affectedRows > 0) {
      return res.status(200).json({ message: "Order status updated to Cancelled." });
    } else {
      return res.status(404).json({ error: "Order not found." });
    }
  });
});

app.post('/insert-item', upload.single('img'), (req, res) => {
  const { name, price, description } = req.body;

  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;

  const query = `
    INSERT INTO item_list (name, img, price, description)
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [name, imgPath, price, description], (err, result) => {
    if (err) {
      console.error('Error inserting item:', err);
      res.status(500).json({ error: 'Error inserting item into the database.' });
    } else {
      res.status(200).json({ message: 'Item inserted successfully.' });
    }
  });
});


app.get('/items-fetch', (req, res) => {
  const query = 'SELECT * FROM item_list WHERE status = 1';

  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching data:', err);
      res.status(500).send('An error occurred while fetching data.');
      return;
    }

    // Map through the results and update the img field with the full path
    const responseData = results.map(row => ({
      ...row,
      img: `http://localhost:5000${row.img}`, // Update img field to include full URL
    }));

    res.json({ data: responseData }); // Send updated data
    console.log(responseData); // Optionally log the data
  });
});

app.delete('/delete-item/:id', (req, res) => {
  const { id } = req.params;

  const query = `UPDATE item_list SET status = 0 WHERE id = ?`;

  db.query(query, [id], (err, result) => {
    if (err) {
      console.error('Error deleting item:', err);
      res.status(500).json({ error: 'Error deleting item from the database.' });
    } else {
      res.status(200).json({ message: 'Item deleted (soft delete) successfully.' });
    }
  });
});

app.put('/update-item/:id', upload.single('img'), (req, res) => {
  const { id } = req.params;
  const { name, price, description } = req.body;


  const imgPath = req.file ? `/uploads/${req.file.filename}` : null;


  let query = `UPDATE item_list SET name = ?, price = ?, description = ?`;
  const params = [name, price, description];

  if (imgPath) {
    query += `, img = ?`;
    params.push(imgPath);
  }

  query += ` WHERE id = ?`;
  params.push(id);

  db.query(query, params, (err, result) => {
    if (err) {
      console.error('Error updating item:', err);
      res.status(500).json({ error: 'Error updating item in the database.' });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ error: 'No item found with the given ID.' });
    } else {
      res.status(200).json({
        message: 'Item updated successfully!',
        updatedData: {
          id,
          name,
          price,
          description,
          imgUrl: imgPath ? `http://localhost:5000${imgPath}` : undefined, // Send the updated image URL
        },
      });
    }
  });
});

app.get('/lowest-items', (req, res) => {
  const query = 'SELECT * FROM item_list WHERE status = 1 ORDER BY price ASC LIMIT 4';
  db.query(query, (err, results) => {
    if (err) {
      console.error('Error fetching items:', err);
      return res.status(500).send('Error fetching items');
    }

    
    const responseData = results.map(row => ({
      ...row,
      img: `http://localhost:5000${row.img}`
    }));
    console.log(responseData)

    res.json(responseData); 
  });
});

const transporter = nodemailer.createTransport({
  service: 'gmail',  
  auth: {
    user: 'shop84328@gmail.com',   
    pass: 'auxk youu pfsf icqb'    
  },
  tls: {
    rejectUnauthorized: false    
  }
});
app.post('/send_email_order', (req, res) => {
  const { firstname, lastname, address, town, postcode, mobile, email, delivery_date, cart_items  } = req.body;
  const totalAmount = cart_items.reduce((total, item) => total + (item.quantity * item.price), 0);


  
  let emailContent = `
    Following Mail Is From Fruitable Website 🛒
    Order Confirmation
    Pls Check Following Details🛍️
    Customer Name: ${firstname} ${lastname}
    Delivery Address: ${address}, ${town}, ${postcode}
    Mobile: ${mobile}
    Delivery Date: ${delivery_date}

    Items:
    ${cart_items.map(item => `- ${item.name} (Quantity: ${item.quantity}, Price: ₹${item.price})`).join("\n")}

    Total: ₹${totalAmount}
  `;

  
  const mailOptions = {
    from: 'shop84328@gmail.com', 
    to: email,
    subject: 'Order Confirmation',
    text: emailContent
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.log('Error sending email:', error);
      return res.status(500).json({ message: "Failed to send email" });
    }
    console.log('Email sent:', info.response);
    res.status(200).json({ message: "Order email sent successfully!" });
  });
});





app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
