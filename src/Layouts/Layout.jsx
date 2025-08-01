export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#020617] relative text-white">
      {/* Purple Radial Glow Background */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `radial-gradient(circle 500px at 50% 100px, rgba(139,92,246,0.4), transparent)`,
        }}
      />
      
      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}
