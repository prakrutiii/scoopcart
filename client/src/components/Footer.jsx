export default function Footer() {
  return (
    <footer className="border-t bg-white mt-8">
      <div className="max-w-6xl mx-auto px-4 py-4 text-center text-sm text-gray-500">
        © {new Date().getFullYear()} ScoopCart · Built with the MERN stack
      </div>
    </footer>
  );
}