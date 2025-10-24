/**
 * Check if browser tab is active or inactive
 * @param onInactive
 * @param onActive
 * @returns {(function(): void)|*}
 */
export const handleTabVisibility = (onInactive, onActive) => {
  const handleVisibilityChange = () => {
    if (document.hidden) {
      onInactive?.();
    } else {
      onActive?.();
    }
  };

  document.addEventListener('visibilitychange', handleVisibilityChange);

  return () => {
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };
};

/**
 * Converts a string from camelCase to kebap-case
 * @param str
 * @returns {string}
 */
export function camelToKebab(str) {
  return str
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2') // insert dash between lowerCase and upperCase
    .replace(/([A-Z])([A-Z][a-z])/g, '$1-$2') // handle consecutive capitals
    .toLowerCase();
}
