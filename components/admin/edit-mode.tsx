"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";

const STORAGE_KEY = "dml:edit-mode";

type EditModeValue = {
  /** Whether the current visitor is an admin at all. */
  isAdmin: boolean;
  /** Whether edit affordances should currently be visible. */
  enabled: boolean;
  toggle: () => void;
};

const EditModeContext = createContext<EditModeValue>({
  isAdmin: false,
  enabled: false,
  toggle: () => {},
});

/**
 * Holds the site-wide "edit mode" switch for admins.
 *
 * Edit mode starts off, so an admin sees the page exactly as a visitor does
 * until they deliberately turn it on. The choice is remembered per browser so
 * it survives navigation between pages.
 */
export function EditModeProvider({
  isAdmin,
  children,
}: {
  isAdmin: boolean;
  children: React.ReactNode;
}) {
  const [enabled, setEnabled] = useState(false);

  // Read after mount: the server cannot know the stored preference, so reading
  // it during render would cause a hydration mismatch.
  useEffect(() => {
    if (!isAdmin) return;
    try {
      setEnabled(window.localStorage.getItem(STORAGE_KEY) === "1");
    } catch {
      // Private browsing or blocked storage — stay off.
    }
  }, [isAdmin]);

  const toggle = useCallback(() => {
    setEnabled((current) => {
      const next = !current;
      try {
        window.localStorage.setItem(STORAGE_KEY, next ? "1" : "0");
      } catch {
        // Preference simply will not persist.
      }
      return next;
    });
  }, []);

  return (
    <EditModeContext.Provider value={{ isAdmin, enabled: isAdmin && enabled, toggle }}>
      {children}
    </EditModeContext.Provider>
  );
}

export function useEditMode() {
  return useContext(EditModeContext);
}
