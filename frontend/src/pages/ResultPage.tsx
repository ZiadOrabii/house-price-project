import { useLocation, Link } from "react-router-dom";

export default function ResultPage() {
  const location = useLocation();
  const price = location.state?.predictedPrice as number | undefined;

  if (price === undefined) {
    return (
      <div>
        <p>No prediction available.</p>
        <Link to="/">Go back</Link>
      </div>
    );
  }

  const formatted = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(price);

  return (
    <div>
      <h1>Predicted Price</h1>
      <p style={{ fontSize: "2rem" }}>{formatted}</p>
      <Link to="/">Predict another</Link>
    </div>
  );
}