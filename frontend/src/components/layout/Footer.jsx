export default function Footer() {
  return (
    <footer className="border-t border-dark-500/50 bg-dark-800/50 py-6 px-6">
      <div className="max-w-[1440px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-dark-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded bg-gradient-to-br from-risk-red to-risk-yellow flex items-center justify-center text-white text-[8px] font-bold">RA</div>
          <span>Bangladesh Road Accident Risk Map</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Data: ~47,000 accident records</span>
          <span className="text-dark-400">|</span>
          <span className="group relative cursor-help">
            Methodology ⓘ
            <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-64 p-3 rounded-lg bg-dark-700 border border-dark-500 text-dark-100 text-xs opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-50">
              Risk zones are calculated by clustering accidents within 500m radius using Haversine distance. Risk score = (deaths×3 + injuries×1) × log(accidentCount+1). Top 15% = Red, middle 35% = Yellow, bottom 50% = Green.
            </span>
          </span>
        </div>
        <span>© {new Date().getFullYear()} Open Data</span>
      </div>
    </footer>
  );
}
