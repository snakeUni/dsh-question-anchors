// @dsh-client/ui-question-anchors — host half.
//
// Deliberately empty: this plugin is a pure browser-surface capability. It
// reads the client-side session projection (the current conversation's chat
// nodes) and renders a floating anchor panel in the shell overlay slot — no
// host process, no settings namespace, no model-facing behavior is needed.
// The row exists on the host side only so the Loader can seat the package and
// the client-modules node half can scan it into window.__DSH_BOOT__.

/** Host plugin body — nothing to mount here. */
export function apply() {}
