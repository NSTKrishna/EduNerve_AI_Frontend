import { Link, useLocation } from "react-router-dom"
import { LayoutDashboard, BookOpen } from "lucide-react"
import { UseLearner } from "../../context/LearnerContext"
import Button from "../common/Button"

const links = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Learning", to: "/lms", icon: BookOpen },
] 

export default function LearningSidebar({ open = false, onClose }) {
  const location = useLocation()
  const { learnerProfile, logout } = UseLearner()

  const displayName = learnerProfile?.name || "Alex Smith"
  const displayField = learnerProfile?.field || "Computer Science"
  const avatarUrl = learnerProfile?.avatar
  const initials = displayName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase()

  const handleLogout = () => {
    logout()
    if (onClose) { 
      onClose()
    }
  }

  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/40 lg:hidden" onClick={onClose} />}

      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 transform border-r border-border bg-card transition-transform duration-300 ease-in-out lg:translate-x-0 ${open ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center gap-2 border-b border-border px-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <LayoutDashboard className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">EduNerve AI</p>
              <p className="text-lg font-semibold text-foreground">Learning Suite</p>
            </div>
          </div>

          <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-6">
            {links.map((item) => {
              const isActive = location.pathname === item.to
              const Icon = item.icon

              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={`flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "text-muted-foreground hover:bg-muted/60 hover:text-foreground"
                  }`}
                  onClick={onClose}
                >
                  <Icon className="h-5 w-5" />
                  {item.label}
                </Link>
              )
            })}
          </nav>

          <div className="border-t border-border px-6 py-5">
            <div className="flex items-center gap-3">
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={displayName}
                  className="h-11 w-11 rounded-full border border-border object-cover"
                  referrerPolicy="no-referrer"
                />
              ) : (
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground font-semibold">
                  {initials || "AS"}
                </div>
              )}
              <div className="min-w-0">
                <p className="text-sm font-semibold text-foreground truncate">{displayName}</p>
                <p className="text-xs text-muted-foreground truncate">{displayField}</p>
              </div>
            </div>
            <Button className="mt-4 w-full" variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </aside>
    </>
  )
}
