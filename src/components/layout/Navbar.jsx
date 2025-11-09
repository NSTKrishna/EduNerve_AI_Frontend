import { useNavigate } from "react-router-dom"
import { useState, useRef, useEffect } from "react"
import { UseLearner } from "../../context/LearnerContext"

export default function Navbar() {
  const { isAuthenticated, learnerProfile, authUser, logout } = UseLearner()
  const navigate = useNavigate()
  const [showDropdown, setShowDropdown] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
    navigate("/login")
  }

  if (!isAuthenticated || !learnerProfile) {
    return null
  }

  const userAvatar = authUser?.picture || learnerProfile?.avatar
  const userName = learnerProfile?.name || "Learner"
  const userInitials = userName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2)

  return (
    <nav className="bg-card border-b border-border sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-end h-16">
          <div className="flex items-center gap-4">
            <div className="relative" ref={dropdownRef}>
              <button
                onClick={() => setShowDropdown(!showDropdown)}
                className="flex items-center gap-3 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <span className="text-sm text-muted-foreground hidden sm:block">{userName}</span>
                {userAvatar ? (
                  <img
                    src={userAvatar}
                    alt={userName}
                    className="w-8 h-8 rounded-full border-2 border-primary object-cover cursor-pointer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-semibold cursor-pointer">
                    {userInitials}
                  </div>
                )}
              </button>

              {showDropdown && (
                <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1 z-50">
                  <div className="px-4 py-2 border-b border-border">
                    <p className="text-sm font-medium text-foreground">{userName}</p>
                    <p className="text-xs text-muted-foreground truncate">{learnerProfile?.email}</p>
                  </div>
                  <button
                    onClick={() => {
                      setShowDropdown(false)
                      navigate("/dashboard")
                    }}
                    className="w-full text-left px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors cursor-pointer"
                  >
                    Dashboard
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-muted transition-colors cursor-pointer"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  )
}
