import re

filepath = r"e:\laragon\www\Project IWPAINT\iwpaint-dashboard\patch-01\backend\server.js"
with open(filepath, 'r', encoding='utf-8') as f:
    content = f.read()

# Replace the incorrect routing section that I just added
bad_routing = """const authRoutes = require("./routes/authRoutes");
const usersRoutes = require("./routes/userRoutes");
const targetRoutes = require("./routes/targetRoutes");
const customerRoutes = require("./routes/customerRoutes");
const productRoutes = require("./routes/productRoutes");
const attendanceRoutes = require("./routes/attendanceRoutes");

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/users", usersRoutes);
app.use("/api/sales", salesRoutes);
app.use("/api/targets", targetRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/products", productRoutes);
app.use("/api/attendance", attendanceRoutes);"""

good_routing = """app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/targets', require('./routes/targetRoutes'));
app.use('/api/customers', require('./routes/customerRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));
app.use('/api/sales', require('./routes/salesRoutes'));
app.use('/api/attendance', require('./routes/attendanceRoutes'));"""

content = content.replace(bad_routing, good_routing)

with open(filepath, 'w', encoding='utf-8') as f:
    f.write(content)
