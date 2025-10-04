import { useThemeStore } from "../store/useThemeStore";
import { THEMES } from "../constants";

const SettingsPage = () => {
  const { theme, setTheme } = useThemeStore();

  // DaisyUI main colors for preview
  const COLOR_PREVIEW = [
    "primary",
    "secondary",
    "accent",
    "neutral"
  ];

  return (
    <div className="h-screen container mx-auto px-4 pt-20 max-w-5xl">
      <div className="space-y-6">
        {/* Theme Section */}
        <div className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">Choose a theme for your chat interface</p>
        </div>

        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-3">
          {THEMES.map((t) => (
            <button
              key={t}
              className={`group flex flex-col items-center gap-1.5 p-2 rounded-lg transition-all border-2 ${
                theme === t ? "border-primary bg-base-200" : "border-transparent hover:border-base-300"
              }`}
              onClick={() => setTheme(t)}
            >
              <div
                className="relative h-8 w-16 rounded-md overflow-hidden grid grid-cols-4 gap-px"
                data-theme={t} // Important for DaisyUI preview
              >
                {COLOR_PREVIEW.map((c) => (
                  <div key={c} className={`bg-${c} rounded`} />
                ))}
              </div>
              <span className="text-[11px] font-medium truncate w-full text-center">
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </span>
            </button>
          ))}
        </div>

        {/* Preview Section */}
        <h3 className="text-lg font-semibold mt-6">Preview</h3>
        <div className="rounded-xl border border-base-300 overflow-hidden bg-base-100 shadow-lg">
          <div className="p-4 bg-base-200">
            <div className="max-w-lg mx-auto">
              <div className="bg-base-100 rounded-xl shadow-sm overflow-hidden">
                {/* Chat Header */}
                <div className="px-4 py-3 border-b border-base-300 bg-base-100 flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-content font-medium">
                    J
                  </div>
                  <div>
                    <h3 className="font-medium text-sm">John Doe</h3>
                    <p className="text-xs text-base-content/70">Online</p>
                  </div>
                </div>

                {/* Chat Messages */}
                <div className="p-4 space-y-4 min-h-[200px] max-h-[200px] overflow-y-auto bg-base-100">
                  <div className="flex justify-start">
                    <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-base-200">
                      <p className="text-sm">Hey! How's it going?</p>
                      <p className="text-[10px] mt-1.5 text-base-content/70">12:00 PM</p>
                    </div>
                  </div>
                  <div className="flex justify-end">
                    <div className="max-w-[80%] rounded-xl p-3 shadow-sm bg-primary text-primary-content">
                      <p className="text-sm">I'm doing great! Just working on some new features.</p>
                      <p className="text-[10px] mt-1.5 text-primary-content/70">12:01 PM</p>
                    </div>
                  </div>
                </div>

                {/* Chat Input */}
                <div className="p-4 border-t border-base-300 bg-base-100 flex gap-2">
                  <input
                    type="text"
                    className="input input-bordered flex-1 text-sm h-10"
                    placeholder="Type a message..."
                    value="This is a preview"
                    readOnly
                  />
                  <button className="btn btn-primary h-10 min-h-0">Send</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
