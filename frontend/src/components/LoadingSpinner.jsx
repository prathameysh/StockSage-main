const LoadingSpinner = ({ size = "medium", text = "Loading..." }) => {
  const sizeClasses = {
    small: "w-4 h-4",
    medium: "w-8 h-8",
    large: "w-12 h-12",
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className={`loading-spinner ${sizeClasses[size]} mb-4`}></div>
      <p className="text-gray-600">{text}</p>
    </div>
  )
}

export default LoadingSpinner
