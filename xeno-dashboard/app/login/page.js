"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import Link from "next/link";
import "./login.css";
export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login } = useAuth();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // NUCLEAR OPTION: Direct Railway URL (v3.0 - BYPASS ALL CACHING)
      const RAILWAY_URL =
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3006";
      console.log("🔥 NUCLEAR VERSION 3.0 - Using Railway URL:", RAILWAY_URL);
      console.log(
        "🔥 If you see the old URL in network tab, clear ALL browser data!"
      );

      const response = await fetch(
        `${RAILWAY_URL}/api/auth/login-tenant?t=${Date.now()}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: email.trim(),
            password: password.trim(),
          }),
        }
      );

      const data = await response.json();

      if (data.success) {
        // Use the new tenant authentication data
        await login({
          email: data.user.email,
          tenantId: data.tenant?.id || null,
          tenantName: data.tenant?.name || "",
          tenantDomain: data.tenant?.domain || "",
          firstName: data.user.firstName,
          lastName: data.user.lastName,
          role: data.user.role,
        });

        // Store token for API requests
        localStorage.setItem("token", data.token);

        router.push("/");
      } else {
        setError(data.message || "Login failed");
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="login-container">
        <nav className="navbar">
          <div className="navbar-content">
            <div className="navbar-inner">
              {/* Logo Section */}
              <div className="logo-section">
                {/* <div className="logo-images">
                  <img
                    src="Images/shopify.png"
                    alt="Shopify"
                    className="logo-img"
                  />
                  <img src="Images/cross.gif" alt="×" className="logo-cross" />
                  <img src="Images/xeno.png" alt="Xeno" className="logo-img" />
                </div> */}
                <div className="logo-text">
                  <h1>Xeno Analytics</h1>
                  <p>Shopify Integration Platform</p>
                </div>
              </div>

              {/* Right Section */}
              <div className="navbar-right">
                <span>Enterprise Dashboard</span>
              </div>
            </div>
          </div>
        </nav>

        {/* Split Screen Content */}
        <div className="split-screen">
          {/* Left Side - Branding */}
          <div className="branding-side">
            <div className="branding-content">
              <div className="branding-logo-container">
                <img
                  src="Images/shopify.png"
                  alt="Shopify"
                  className="branding-logo"
                />
                <img
                  src="Images/cross.gif"
                  alt="×"
                  className="branding-cross"
                />
                <img
                  src="Images/xeno.png"
                  alt="Xeno"
                  className="branding-logo"
                />
              </div>

              <h1 className="branding-title">
                Powerful Analytics for Your Shopify Store
              </h1>

              <p className="branding-subtitle">
                Connect your Shopify store with Xeno's advanced analytics
                platform for real-time insights and data-driven decisions.
              </p>

              <div className="features-box">
                <h3 className="features-title">Platform Capabilities</h3>
                <div className="features-grid">
                  <p className="feature-item">
                    <span className="feature-bullet">•</span>
                    <span>Multi-store management</span>
                  </p>
                  <p className="feature-item">
                    <span className="feature-bullet">•</span>
                    <span>Real-time synchronization</span>
                  </p>
                  <p className="feature-item">
                    <span className="feature-bullet">•</span>
                    <span>Advanced reporting tools</span>
                  </p>
                  <p className="feature-item">
                    <span className="feature-bullet">•</span>
                    <span>Secure data isolation</span>
                  </p>
                  <p className="feature-item">
                    <span className="feature-bullet">•</span>
                    <span>Customer segmentation</span>
                  </p>
                  <p className="feature-item">
                    <span className="feature-bullet">•</span>
                    <span>Automated workflows</span>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <div className="form-side">
            <div className="form-container">
              {/* Form Header */}
              <div className="form-header">
                <div className="form-icon">🔐</div>
                <h2 className="form-title">Sign In</h2>
                <p className="form-subtitle">
                  Access your store analytics dashboard
                </p>
              </div>

              <form onSubmit={handleSubmit} className="login-form">
                <div className="form-group">
                  <label className="form-label">Email Address</label>
                  <input
                    type="email"
                    required
                    className="form-input"
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    type="password"
                    required
                    className="form-input"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="submit-button"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </button>
              </form>

              {error && (
                <div className="error-message">
                  <span>⚠</span>
                  {error}
                </div>
              )}

              {/* Registration Link */}
              <div className="registration-section">
                <p className="registration-text">Don't have an account yet?</p>
                <Link href="/register" className="registration-link">
                  Register Your Store
                  <span>→</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
