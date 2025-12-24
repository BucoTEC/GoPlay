"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  Bot,
  Activity,
  Brain,
  Heart,
  Droplets,
  FlaskConical,
  Settings,
  ChevronLeft,
  ChevronRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Patients", href: "/patients", icon: Users },
  { name: "AI Assistant", href: "/ai-agent", icon: Bot },
  {
    name: "Clinical Models",
    href: "#",
    icon: Brain,
    children: [
      { name: "Metabolic Clustering", href: "/models/metabolic", icon: FlaskConical },
      { name: "Blood Pressure", href: "/models/blood-pressure", icon: Activity },
      { name: "CKD Risk", href: "/models/ckd-risk", icon: Droplets },
      { name: "Diabetes Risk", href: "/models/diabetes", icon: Heart },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()
  const [collapsed, setCollapsed] = useState(false)
  const [expandedGroups, setExpandedGroups] = useState<string[]>(["Clinical Models"])

  const toggleGroup = (name: string) => {
    setExpandedGroups((prev) => (prev.includes(name) ? prev.filter((g) => g !== name) : [...prev, name]))
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-foreground text-card transition-all duration-300",
        collapsed ? "w-16" : "w-64",
      )}
    >
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary">
              <Brain className="w-5 h-5 text-primary-foreground" />
            </div>
            <span className="text-lg font-semibold text-white">ClinicalAI</span>
          </div>
        )}
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setCollapsed(!collapsed)}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </Button>
      </div>

      <nav className="flex-1 p-2 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          if (item.children) {
            const isExpanded = expandedGroups.includes(item.name)
            const isChildActive = item.children.some((child) => pathname === child.href)

            return (
              <div key={item.name}>
                <button
                  onClick={() => toggleGroup(item.name)}
                  className={cn(
                    "flex items-center w-full gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                    isChildActive ? "bg-primary/20 text-primary" : "text-white/70 hover:bg-white/10 hover:text-white",
                  )}
                >
                  <item.icon className="w-5 h-5 shrink-0" />
                  {!collapsed && (
                    <>
                      <span className="flex-1 text-left">{item.name}</span>
                      <ChevronRight className={cn("w-4 h-4 transition-transform", isExpanded && "rotate-90")} />
                    </>
                  )}
                </button>
                {!collapsed && isExpanded && (
                  <div className="mt-1 ml-4 space-y-1 border-l border-white/10 pl-4">
                    {item.children.map((child) => (
                      <Link
                        key={child.href}
                        href={child.href}
                        className={cn(
                          "flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors",
                          pathname === child.href
                            ? "bg-primary text-primary-foreground"
                            : "text-white/60 hover:bg-white/10 hover:text-white",
                        )}
                      >
                        <child.icon className="w-4 h-4" />
                        <span>{child.name}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            )
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )}
            >
              <item.icon className="w-5 h-5 shrink-0" />
              {!collapsed && <span>{item.name}</span>}
            </Link>
          )
        })}
      </nav>

      <div className="p-2 border-t border-white/10">
        <Link
          href="/settings"
          className={cn(
            "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
            pathname === "/settings"
              ? "bg-primary text-primary-foreground"
              : "text-white/70 hover:bg-white/10 hover:text-white",
          )}
        >
          <Settings className="w-5 h-5 shrink-0" />
          {!collapsed && <span>Settings</span>}
        </Link>
      </div>
    </aside>
  )
}
