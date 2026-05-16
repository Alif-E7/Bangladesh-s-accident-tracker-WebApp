import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="flex-1 flex items-center justify-center p-6" id="not-found-page">
      <div className="text-center animate-fade-in">
        <div className="text-6xl mb-4">🗺️</div>
        <h1 className="text-4xl font-bold text-white mb-2">404</h1>
        <p className="text-dark-300 mb-6">This route doesn't exist on our map</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-accent hover:bg-accent-light text-white text-sm font-medium transition-colors no-underline"
        >
          ← Back to Map
        </Link>
      </div>
    </div>
  );
}
