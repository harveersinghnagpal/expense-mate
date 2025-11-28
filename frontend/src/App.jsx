function App() {

  return (
    <>
      <meta charSet="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Expense Mate - Your Finance Buddy</title>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n        * {\n            margin: 0;\n            padding: 0;\n            box-sizing: border-box;\n        }\n\n        :root {\n            --primary: #10b981;\n            --primary-dark: #059669;\n            --secondary: #06b6d4;\n            --accent: #f59e0b;\n            --background: #0f172a;\n            --surface: #1e293b;\n            --surface-light: #334155;\n            --text: #f1f5f9;\n            --text-secondary: #cbd5e1;\n            --border: #475569;\n        }\n\n        body {\n            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;\n            background: linear-gradient(135deg, var(--background) 0%, #1a2744 100%);\n            color: var(--text);\n            line-height: 1.6;\n            overflow-x: hidden;\n        }\n\n        /* Navigation */\n        nav {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding: 1.5rem 2rem;\n            max-width: 1400px;\n            margin: 0 auto;\n            position: relative;\n            z-index: 10;\n        }\n\n        .logo {\n            font-size: 1.5rem;\n            font-weight: 700;\n            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n            background-clip: text;\n        }\n\n        nav ul {\n            display: flex;\n            list-style: none;\n            gap: 2rem;\n            align-items: center;\n        }\n\n        nav a {\n            color: var(--text-secondary);\n            text-decoration: none;\n            transition: color 0.3s;\n            font-size: 0.95rem;\n        }\n\n        nav a:hover {\n            color: var(--primary);\n        }\n\n        .btn {\n            padding: 0.75rem 1.5rem;\n            border: none;\n            border-radius: 50px;\n            font-weight: 600;\n            cursor: pointer;\n            transition: all 0.3s;\n            font-size: 0.95rem;\n        }\n\n        .btn-primary {\n            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);\n            color: white;\n        }\n\n        .btn-primary:hover {\n            transform: translateY(-2px);\n            box-shadow: 0 10px 30px rgba(16, 185, 129, 0.3);\n        }\n\n        /* Hero Section */\n        .hero {\n            max-width: 1400px;\n            margin: 0 auto;\n            padding: 4rem 2rem;\n            display: grid;\n            grid-template-columns: 1fr 1fr;\n            gap: 4rem;\n            align-items: center;\n        }\n\n        .hero-content h1 {\n            font-size: 3.5rem;\n            margin-bottom: 1.5rem;\n            line-height: 1.2;\n            background: linear-gradient(135deg, var(--text) 0%, var(--secondary) 100%);\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n            background-clip: text;\n        }\n\n        .hero-content p {\n            font-size: 1.1rem;\n            color: var(--text-secondary);\n            margin-bottom: 2rem;\n            line-height: 1.8;\n        }\n\n        .hero-content .btn {\n            margin-top: 1rem;\n        }\n\n        .dashboard-preview {\n            background: var(--surface);\n            border: 1px solid var(--border);\n            border-radius: 20px;\n            padding: 1.5rem;\n            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);\n            animation: float 3s ease-in-out infinite;\n        }\n\n        @keyframes float {\n            0%, 100% { transform: translateY(0); }\n            50% { transform: translateY(-10px); }\n        }\n\n        .dashboard-header {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            margin-bottom: 1.5rem;\n            padding-bottom: 1rem;\n            border-bottom: 1px solid var(--border);\n        }\n\n        .dashboard-header h3 {\n            font-size: 0.9rem;\n            color: var(--text-secondary);\n            text-transform: uppercase;\n            letter-spacing: 0.05em;\n        }\n\n        .balance-card {\n            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);\n            border-radius: 15px;\n            padding: 1.5rem;\n            margin-bottom: 1.5rem;\n            color: white;\n        }\n\n        .balance-label {\n            font-size: 0.85rem;\n            opacity: 0.9;\n            margin-bottom: 0.5rem;\n        }\n\n        .balance-amount {\n            font-size: 2rem;\n            font-weight: 700;\n            margin-bottom: 1rem;\n        }\n\n        .balance-change {\n            display: flex;\n            align-items: center;\n            gap: 0.5rem;\n            font-size: 0.9rem;\n        }\n\n        .expense-row {\n            display: flex;\n            justify-content: space-between;\n            align-items: center;\n            padding: 1rem;\n            background: var(--surface-light);\n            border-radius: 10px;\n            margin-bottom: 0.75rem;\n        }\n\n        .expense-info {\n            display: flex;\n            align-items: center;\n            gap: 1rem;\n        }\n\n        .expense-icon {\n            width: 40px;\n            height: 40px;\n            border-radius: 10px;\n            background: var(--primary);\n            display: flex;\n            align-items: center;\n            justify-content: center;\n            font-size: 1.2rem;\n        }\n\n        .expense-details h4 {\n            font-size: 0.95rem;\n            margin-bottom: 0.2rem;\n        }\n\n        .expense-details p {\n            font-size: 0.8rem;\n            color: var(--text-secondary);\n        }\n\n        .expense-amount {\n            font-weight: 600;\n            font-size: 0.95rem;\n        }\n\n        .expense-amount.positive {\n            color: var(--primary);\n        }\n\n        .expense-amount.negative {\n            color: var(--accent);\n        }\n\n        /* Features Section */\n        .features {\n            max-width: 1400px;\n            margin: 6rem auto;\n            padding: 0 2rem;\n        }\n\n        .features h2 {\n            font-size: 2.5rem;\n            text-align: center;\n            margin-bottom: 4rem;\n            background: linear-gradient(135deg, var(--text) 0%, var(--secondary) 100%);\n            -webkit-background-clip: text;\n            -webkit-text-fill-color: transparent;\n            background-clip: text;\n        }\n\n        .feature-grid {\n            display: grid;\n            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));\n            gap: 2rem;\n        }\n\n        .feature-card {\n            background: var(--surface);\n            border: 1px solid var(--border);\n            border-radius: 15px;\n            padding: 2rem;\n            transition: all 0.3s;\n        }\n\n        .feature-card:hover {\n            border-color: var(--primary);\n            box-shadow: 0 10px 40px rgba(16, 185, 129, 0.1);\n            transform: translateY(-5px);\n        }\n\n        .feature-icon {\n            font-size: 2.5rem;\n            margin-bottom: 1rem;\n        }\n\n        .feature-card h3 {\n            font-size: 1.2rem;\n            margin-bottom: 0.75rem;\n        }\n\n        .feature-card p {\n            color: var(--text-secondary);\n            font-size: 0.95rem;\n        }\n\n        /* CTA Section */\n        .cta {\n            max-width: 1400px;\n            margin: 6rem auto;\n            padding: 4rem 2rem;\n            background: linear-gradient(135deg, var(--primary) 0%, var(--secondary) 100%);\n            border-radius: 20px;\n            text-align: center;\n        }\n\n        .cta h2 {\n            font-size: 2.5rem;\n            color: white;\n            margin-bottom: 1rem;\n        }\n\n        .cta p {\n            color: rgba(255, 255, 255, 0.9);\n            font-size: 1.1rem;\n            margin-bottom: 2rem;\n        }\n\n        .cta .btn {\n            background: white;\n            color: var(--primary);\n            font-weight: 700;\n        }\n\n        .cta .btn:hover {\n            transform: scale(1.05);\n        }\n\n        /* Footer */\n        footer {\n            background: var(--surface);\n            border-top: 1px solid var(--border);\n            padding: 2rem;\n            text-align: center;\n            color: var(--text-secondary);\n            margin-top: 4rem;\n        }\n\n        /* Responsive */\n        @media (max-width: 768px) {\n            .hero {\n                grid-template-columns: 1fr;\n                padding: 2rem 1rem;\n            }\n\n            .hero-content h1 {\n                font-size: 2rem;\n            }\n\n            nav ul {\n                gap: 1rem;\n                font-size: 0.85rem;\n            }\n\n            .features h2,\n            .cta h2 {\n                font-size: 1.8rem;\n            }\n        }\n    "
        }}
      />
      {/* Navigation */}
      <nav>
        <div className="logo">💰 Expense Mate</div>
        <ul>
          <li>
            <a href="#features">Features</a>
          </li>
          <li>
            <a href="#pricing">Pricing</a>
          </li>
          <li>
            <a href="#about">About</a>
          </li>
          <li>
            <button className="btn btn-primary">Get Started</button>
          </li>
        </ul>
      </nav>
      {/* Hero Section */}
      <section className="hero">
        <div className="hero-content">
          <h1>Take Control of Your Finances</h1>
          <p>
            Track expenses, manage budgets, and achieve your financial goals with
            Expense Mate—your intelligent finance buddy that simplifies money
            management.
          </p>
          <button className="btn btn-primary">Start Tracking Now</button>
        </div>
        {/* Dashboard Preview */}
        <div className="dashboard-preview">
          <div className="dashboard-header">
            <h3>Your Dashboard</h3>
            <span style={{ fontSize: "0.8rem", color: "var(--text-secondary)" }}>
              Nov 2025
            </span>
          </div>
          <div className="balance-card">
            <div className="balance-label">Total Balance</div>
            <div className="balance-amount">$4,824.50</div>
            <div className="balance-change">
              <span>↑ 12.5% from last month</span>
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <h4
              style={{
                fontSize: "0.85rem",
                color: "var(--text-secondary)",
                marginBottom: "0.75rem",
                textTransform: "uppercase",
                letterSpacing: "0.05em"
              }}
            >
              Recent Transactions
            </h4>
          </div>
          <div className="expense-row">
            <div className="expense-info">
              <div className="expense-icon">☕</div>
              <div className="expense-details">
                <h4>Coffee</h4>
                <p>Today</p>
              </div>
            </div>
            <div className="expense-amount negative">-$5.20</div>
          </div>
          <div className="expense-row">
            <div className="expense-info">
              <div className="expense-icon">🛒</div>
              <div className="expense-details">
                <h4>Groceries</h4>
                <p>Yesterday</p>
              </div>
            </div>
            <div className="expense-amount negative">-$85.40</div>
          </div>
          <div className="expense-row">
            <div className="expense-info">
              <div className="expense-icon">💵</div>
              <div className="expense-details">
                <h4>Salary Deposit</h4>
                <p>2 days ago</p>
              </div>
            </div>
            <div className="expense-amount positive">+$3,200.00</div>
          </div>
          <div className="expense-row">
            <div className="expense-info">
              <div className="expense-icon">🎬</div>
              <div className="expense-details">
                <h4>Entertainment</h4>
                <p>3 days ago</p>
              </div>
            </div>
            <div className="expense-amount negative">-$15.99</div>
          </div>
        </div>
      </section>
      {/* Features Section */}
      <section className="features" id="features">
        <h2>Powerful Features for Smart Spending</h2>
        <div className="feature-grid">
          <div className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>Smart Analytics</h3>
            <p>
              Get detailed insights into your spending patterns with AI-powered
              analytics and personalized recommendations.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🎯</div>
            <h3>Budget Goals</h3>
            <p>
              Set and track multiple budget goals. Get alerts when you're
              approaching limits and celebrate when you stay on track.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🔐</div>
            <h3>Bank-Level Security</h3>
            <p>
              Your financial data is protected with enterprise-grade encryption and
              industry-leading security standards.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">💳</div>
            <h3>Multi-Account Support</h3>
            <p>
              Connect all your accounts in one place and get a unified view of your
              complete financial picture.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">📱</div>
            <h3>Mobile-First Design</h3>
            <p>
              Manage your finances on the go with our fully responsive mobile app
              available on iOS and Android.
            </p>
          </div>
          <div className="feature-card">
            <div className="feature-icon">🤖</div>
            <h3>AI Assistant</h3>
            <p>
              Chat with our intelligent assistant to get personalized financial
              advice and spend management tips.
            </p>
          </div>
        </div>
      </section>
      {/* CTA Section */}
      <section className="cta">
        <h2>Ready to Master Your Finances?</h2>
        <p>
          Join thousands of users who are already saving more and spending smarter
          with Expense Mate
        </p>
        <button className="btn btn-primary">Start Your Free Trial Today</button>
      </section>
      {/* Footer */}
      <footer>
        <p>© 2025 Expense Mate. All rights reserved. | Your Finance Buddy</p>
      </footer>
    </>

  )
}

export default App
