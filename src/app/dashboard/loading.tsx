export default function Loading() {
  return (
    <div className="fixed top-0 left-0 z-50 w-full h-1 bg-secondary">
      <div className="h-full bg-primary animate-progress-bar" />
    </div>
  );
}
