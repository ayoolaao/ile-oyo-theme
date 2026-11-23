// Status roles: which palette color means error, warning, info and success.
// Shared by every target that shows status (VS Code, JetBrains, Kate, Typora,
// CSS). Aliases of existing accents, so the palette's contrast rules already
// cover them. Documented in docs/architecture.md under "Status roles".
import { blend } from './palette.mjs';

export const STATUS = {
  error: 'red',
  warning: 'yellow',
  info: 'blue',
  success: 'green',
};

// Alpha of a status color laid over bg for a tinted surface (banners, badges,
// alerts). At 15% the variant's fg stays above 8:1 on it, and the status color
// above 3:1 (enough for a border or icon, not for text).
export const STATUS_BG_ALPHA = '26';

/** A variant's status colors: { error, errorBg, warning, warningBg, … }. */
export function statusColors(v) {
  const out = {};
  for (const [role, key] of Object.entries(STATUS)) {
    out[role] = v.palette[key];
    out[`${role}Bg`] = blend(v.palette[key] + STATUS_BG_ALPHA, v.palette.bg);
  }
  return out;
}
