// App.jsx or Layout.jsx
export default function Layout({ children }) {
  return (
    <div className="min-h-screen w-full bg-[#E6F0FA] relative text-black">
      {/* Grid Pattern Overlay */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, #b3c6e0 1px, transparent 1px),
            linear-gradient(to bottom, #b3c6e0 1px, transparent 1px)
          `,
          backgroundSize: "20px 20px",
          opacity: 0.3, // Optional: make the grid subtle
        }}
      />
      {/* Main Content */}
      <div className="relative z-10">{children}</div>
    </div>
  );
}