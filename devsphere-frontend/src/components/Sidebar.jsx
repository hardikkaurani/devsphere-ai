import { useState } from "react"
import { Menu, Search, Plus } from "lucide-react"

function Sidebar({
  sessions,
  activeSession,
  onSelectSession,
  sidebarOpen,
  setSidebarOpen
}) {

  const [search, setSearch] = useState("")

  const filteredSessions = sessions.filter((s) =>
    s.title?.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div
      className={`${
        sidebarOpen ? "w-72" : "w-20"
      } transition-all duration-300 
         bg-[#111827] border-r border-slate-800 
         text-slate-200 p-4 flex flex-col`}
    >

      {/* Top */}
      <div className="flex items-center justify-between mb-6">
        {sidebarOpen && (
          <h2 className="font-semibold text-lg text-white tracking-wide">
            DevSphere
          </h2>
        )}
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-800 transition"
        >
          <Menu size={18} />
        </button>
      </div>

      {/* New Chat Button */}
      {sidebarOpen && (
        <button
          onClick={() => onSelectSession(null)}
          className="flex items-center gap-2 
                     bg-indigo-600 hover:bg-indigo-500
                     text-white py-2 px-3 rounded-xl 
                     transition duration-200 mb-5"
        >
          <Plus size={16} />
          New Chat
        </button>
      )}

      {/* Search */}
      {sidebarOpen && (
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3 top-3 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search sessions..."
            className="w-full pl-9 pr-3 py-2 rounded-lg 
                       bg-slate-800 border border-slate-700
                       text-white placeholder-slate-400 
                       outline-none focus:border-indigo-500"
          />
        </div>
      )}

      {/* Sessions */}
      <div className="flex-1 overflow-y-auto space-y-2 pr-1">

        {filteredSessions.length === 0 && sidebarOpen && (
          <div className="text-slate-500 text-sm mt-4 text-center">
            No sessions yet
          </div>
        )}

        {filteredSessions.map((s) => (
          <div
            key={s._id}
            onClick={() => onSelectSession(s._id)}
            className={`p-3 rounded-xl cursor-pointer 
                        transition-all duration-200 truncate ${
              activeSession === s._id
                ? "bg-indigo-600 text-white"
                : "hover:bg-slate-800 text-slate-300"
            }`}
          >
            {sidebarOpen ? (
              <span className="truncate block">
                {s.title || "Untitled Chat"}
              </span>
            ) : (
              "💬"
            )}
          </div>
        ))}

      </div>

      {/* Footer */}
      {sidebarOpen && (
        <div className="pt-4 border-t border-slate-800 text-xs text-slate-500 text-center">
          DevSphere AI v1.0
        </div>
      )}

    </div>
  )
}

export default Sidebar