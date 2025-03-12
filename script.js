// User Credentials
const users = [
    { username: "admin", password: "admin123", role: "admin" },
    { username: "user", password: "user123", role: "user" },
  ];
  
  // Transaction Data (stored in localStorage)
  let transactions = JSON.parse(localStorage.getItem("transactions")) || [];
  
  // Login Functionality
  document.getElementById("loginForm")?.addEventListener("submit", function (e) {
    e.preventDefault();
    const username = document.getElementById("username").value;
    const password = document.getElementById("password").value;
  
    const user = users.find(
      (u) => u.username === username && u.password === password
    );
  
    if (user) {
      localStorage.setItem("currentUser", JSON.stringify(user));
      if (user.role === "admin") {
        window.location.href = "admin-dashboard.html";
      } else {
        window.location.href = "user-dashboard.html";
      }
    } else {
      document.getElementById("errorMessage").textContent =
        "Invalid username or password";
    }
  });
  
  // Admin Dashboard Functionality
  if (window.location.pathname.includes("admin-dashboard.html")) {
    const transactionForm = document.getElementById("addTransactionForm");
    const transactionsTable = document.getElementById("transactionsTable").getElementsByTagName("tbody")[0];
    const totalBalance = document.getElementById("totalBalance");
  
    // Add Transaction
    transactionForm?.addEventListener("submit", function (e) {
      e.preventDefault();
      const name = document.getElementById("transactionName").value;
      const amount = parseFloat(document.getElementById("transactionAmount").value);
  
      transactions.push({ name, amount });
      localStorage.setItem("transactions", JSON.stringify(transactions));
      updateTransactions();
      updateBalance();
      transactionForm.reset();
    });
  
    // Delete Transaction
    function deleteTransaction(index) {
      transactions.splice(index, 1);
      localStorage.setItem("transactions", JSON.stringify(transactions));
      updateTransactions();
      updateBalance();
    }
  
    // Update Transactions Table
    function updateTransactions() {
      transactionsTable.innerHTML = "";
      transactions.forEach((transaction, index) => {
        const row = transactionsTable.insertRow();
        row.innerHTML = `
          <td>${transaction.name}</td>
          <td>$${transaction.amount.toFixed(2)}</td>
          <td><button onclick="deleteTransaction(${index})">Delete</button></td>
        `;
      });
    }
  
    // Update Total Balance
    function updateBalance() {
      const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      totalBalance.textContent = `$${balance.toFixed(2)}`;
    }
  
    // Export to PDF
    document.getElementById("exportPDF")?.addEventListener("click", function () {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("Transactions List", 10, 10);
      transactions.forEach((transaction, index) => {
        doc.text(`${transaction.name}: $${transaction.amount.toFixed(2)}`, 10, 20 + index * 10);
      });
      doc.save("transactions.pdf");
    });
  
    updateTransactions();
    updateBalance();
  }
  
  // User Dashboard Functionality
  if (window.location.pathname.includes("user-dashboard.html")) {
    const userTransactions = document.getElementById("userTransactions");
    const userBalance = document.getElementById("userBalance");
  
    // Update User Transactions
    function updateUserTransactions() {
      userTransactions.innerHTML = "";
      transactions.forEach((transaction) => {
        const li = document.createElement("li");
        li.textContent = `${transaction.name}: $${transaction.amount.toFixed(2)}`;
        userTransactions.appendChild(li);
      });
    }
  
    // Update User Balance
    function updateUserBalance() {
      const balance = transactions.reduce((sum, transaction) => sum + transaction.amount, 0);
      userBalance.textContent = `$${balance.toFixed(2)}`;
    }
  
    updateUserTransactions();
    updateUserBalance();
  }