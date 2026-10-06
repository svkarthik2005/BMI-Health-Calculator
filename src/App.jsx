import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [bmi, setBmi] = useState(null);
  const [status, setStatus] = useState("");
  const [history, setHistory] = useState([]);
  const [darkMode, setDarkMode] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Load saved history
  useEffect(() => {
    const savedHistory = localStorage.getItem("bmiHistory");

    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }

    const savedTheme = localStorage.getItem("darkMode");

    if (savedTheme === "true") {
      setDarkMode(true);
    }
  }, []);

  // Save history
  useEffect(() => {
    localStorage.setItem("bmiHistory", JSON.stringify(history));
  }, [history]);

  // Save theme
  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  const calculateBMI = async (event) => {
    event.preventDefault();

    setError("");
    setBmi(null);
    setStatus("");

    // Validation
    if (!height || !weight) {
      setError("Please enter both height and weight.");
      return;
    }

    if (Number(height) <= 0 || Number(weight) <= 0) {
      setError("Height and weight must be greater than 0.");
      return;
    }

    if (Number(height) < 50 || Number(height) > 250) {
      setError("Please enter a valid height between 50 cm and 250 cm.");
      return;
    }

    if (Number(weight) < 10 || Number(weight) > 300) {
      setError("Please enter a valid weight between 10 kg and 300 kg.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/api/bmi", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          height: Number(height),
          weight: Number(weight),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Something went wrong.");
      }

      setBmi(data.bmi);
      setStatus(data.category);

      const newRecord = {
        height: data.height,
        weight: data.weight,
        bmi: data.bmi,
        category: data.category,
        date: new Date().toLocaleString(),
      };

      setHistory((previousHistory) => [
        newRecord,
        ...previousHistory,
      ]);
    } catch (err) {
      setError(
        "Unable to connect to the server. Please make sure the backend is running."
      );
    } finally {
      setLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm("Are you sure you want to clear BMI history?")) {
      setHistory([]);
      localStorage.removeItem("bmiHistory");
    }
  };

  const toggleDarkMode = () => {
    setDarkMode((previousMode) => !previousMode);
  };

  return (
    <div className={darkMode ? "app dark" : "app"}>
      <header className="header">
        <h1>BMI Health Calculator</h1>

        <button
          className="theme-button"
          onClick={toggleDarkMode}
        >
          {darkMode ? "☀️ Light Mode" : "🌙 Dark Mode"}
        </button>
      </header>

      <main className="container">
        <section className="card">
          <h2>Calculate Your BMI</h2>

          <form onSubmit={calculateBMI}>
            <div className="input-group">
              <label>Height (cm)</label>

              <input
                type="number"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
                placeholder="Example: 170"
              />
            </div>

            <div className="input-group">
              <label>Weight (kg)</label>

              <input
                type="number"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                placeholder="Example: 65"
              />
            </div>

            <button
              type="submit"
              className="calculate-button"
              disabled={loading}
            >
              {loading ? "Calculating..." : "Calculate BMI"}
            </button>
          </form>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}
        </section>

        {bmi !== null && (
  <section className="card result-card">
    <h2>📊 Your BMI Result</h2>

    <div className="bmi-circle">
      <div className="bmi-value">{bmi}</div>
      <span>BMI</span>
    </div>

    <div className="result-status">
      <h3>{status}</h3>
    </div>

    <div className="result-details">
      <div>
        <strong>Height</strong>
        <span>{height} cm</span>
      </div>

      <div>
        <strong>Weight</strong>
        <span>{weight} kg</span>
      </div>
    </div>

    <p className="result-note">
      BMI is a general screening measurement and should not be
      treated as a personal health diagnosis.
    </p>
  </section>
)}

        <section className="card">
          <div className="history-header">
            <h2>BMI History</h2>

            {history.length > 0 && (
              <button
                className="clear-button"
                onClick={clearHistory}
              >
                Clear History
              </button>
            )}
          </div>

          {history.length === 0 ? (
            <p className="empty-history">
              No BMI history yet.
            </p>
          ) : (
            <div className="history-list">
              {history.map((item, index) => (
                <div
                  className="history-item"
                  key={index}
                >
                  <div>
                    <strong>BMI: {item.bmi}</strong>
                    <span>{item.category}</span>
                  </div>

                  <div>
                    <span>
                      Height: {item.height} cm
                    </span>

                    <span>
                      Weight: {item.weight} kg
                    </span>

                    <small>{item.date}</small>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>

      <footer>
        <p>
          BMI Health Calculator • Built with React, Node.js and Express
        </p>
      </footer>
    </div>
  );
}

export default App;