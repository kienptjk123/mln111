export default function Crosshair() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10 flex items-center justify-center">
      <div className="relative">
        {/* Horizontal line */}
        <div className="absolute w-6 h-0.5 bg-white/80 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
        {/* Vertical line */}
        <div className="absolute w-0.5 h-6 bg-white/80 -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
        {/* Center dot */}
        <div className="absolute w-1 h-1 bg-white/80 rounded-full -translate-x-1/2 -translate-y-1/2 top-1/2 left-1/2"></div>
      </div>
    </div>
  )
}
