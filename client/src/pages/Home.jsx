import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="text-center py-16">
      <h1 className="text-4xl font-bold text-pink-600">Welcome to ScoopCart 🍦</h1>
      <p className="mt-4 text-gray-600">
        {user ? `You are logged in as ${user.email}` : "Log in to start ordering."}
      </p>
    </div>
  );
}