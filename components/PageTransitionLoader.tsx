'use client';

export function PageTransitionLoader() {
  return (
    <div
      id="page-loader"
      className="fixed inset-0 z-11 bg-black opacity-0 pointer-events-none transition-opacity duration-300 visible"
    >
    </div>
  );
}