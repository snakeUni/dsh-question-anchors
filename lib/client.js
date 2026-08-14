window.__ModuleLoader__.load({
	id: "@dsh-client/ui-question-anchors",
	factory: (require) => {
		var module = { exports: {} };
		var exports = module.exports;
		Object.defineProperty(exports, Symbol.toStringTag, { value: "Module" });
		let react_jsx_runtime = require("react/jsx-runtime");
		let react = require("react");

		// ── plugin identity ──────────────────────────────────────────────────────
		/** The dsh.client graph id (must equal the package name). */
		const PLUGIN_ID = "@dsh-client/ui-question-anchors";
		/** Locale namespace owned by this plugin. */
		const NS = "questionAnchors";
		/** Required services: slot registry, locale dictionaries, and the session
		 * object layer (read through the binding face — components never see ctx). */
		const inject = ["slots", "locale", "sessions"];

		// ── dictionaries ─────────────────────────────────────────────────────────
		const zh = {
			"title": "提问锚点",
			"count": "{count} 个提问",
			"collapse": "收起面板",
			"expand": "展开面板",
			"empty": "暂无提问",
			"hint": "点击跳转到对应提问",
			"imageOnly": "[图片]"
		};
		const en = {
			"title": "Question Anchors",
			"count": "{count} questions",
			"collapse": "Collapse panel",
			"expand": "Expand panel",
			"empty": "No questions yet",
			"hint": "Click to jump to the question",
			"imageOnly": "[image]"
		};

		// ── styles ───────────────────────────────────────────────────────────────
		const CSS_ID = "@dsh-client/ui-question-anchors/style.css";
		if (typeof document !== "undefined" && document.querySelector("style[data-plugin-css=" + JSON.stringify(CSS_ID) + "]") === null) {
			const tag = document.createElement("style");
			tag.dataset.plugin = PLUGIN_ID;
			tag.dataset.pluginCss = CSS_ID;
			tag.textContent = [
				".dsh-qa-anchors{position:absolute;top:50%;transform:translateY(-50%);z-index:30;display:flex;flex-direction:column;align-items:flex-end;pointer-events:auto;max-height:calc(100vh - 96px)}",
				".dsh-qa-pill{box-sizing:border-box;height:auto;min-height:44px;width:40px;color:var(--dsw-alias-label-secondary);cursor:pointer;background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:999px;box-shadow:var(--dsw-shadow-lv2);flex-direction:column;align-items:center;justify-content:center;gap:6px;padding:8px 0;display:flex;transition:color .15s, border-color .15s, transform .15s}",
				".dsh-qa-pill:hover{color:var(--dsw-alias-state-business-primary);border-color:var(--dsw-alias-state-business-primary)}",
				".dsh-qa-pill:focus-visible,.dsh-qa-toggle:focus-visible,.dsh-qa-item:focus-visible{outline:2px solid var(--dsw-alias-state-business-primary);outline-offset:1px}",
				".dsh-qa-pillCount{color:var(--dsw-alias-label-caption);font-size:11px;line-height:1;font-variant-numeric:tabular-nums}",
				".dsh-qa-card{box-sizing:border-box;width:252px;max-height:calc(100vh - 120px);background:var(--dsw-alias-bg-overlay);border:1px solid var(--dsw-alias-border-l1);border-radius:14px;box-shadow:var(--dsw-shadow-lv2);flex-direction:column;display:flex;overflow:hidden;--dsh-scrollbar-thumb:var(--dsw-alias-scrollbar-bg-l2);--dsh-scrollbar-thumb-hover:var(--dsw-alias-scrollbar-hover-l2)}",
				".dsh-qa-header{box-sizing:border-box;flex:none;align-items:center;gap:8px;padding:10px 8px 10px 14px;display:flex;border-bottom:1px solid var(--dsw-alias-border-l1)}",
				".dsh-qa-title{min-width:0;color:var(--dsw-alias-label-primary);flex:1;font-size:13px;font-weight:600;line-height:20px;white-space:nowrap;text-overflow:ellipsis;overflow:hidden}",
				".dsh-qa-count{flex:none;min-width:20px;height:18px;color:var(--dsw-alias-label-secondary);background:var(--dsw-alias-interactive-bg-hover);border-radius:999px;align-items:center;justify-content:center;padding:0 6px;font-size:11px;line-height:18px;font-variant-numeric:tabular-nums;display:flex}",
				".dsh-qa-toggle{box-sizing:border-box;width:28px;height:28px;color:var(--dsw-alias-label-tertiary);cursor:pointer;background:0 0;border:none;border-radius:8px;flex:none;place-items:center;padding:0;display:grid;transition:color .15s, background .15s}",
				".dsh-qa-toggle:hover{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}",
				".dsh-qa-chevron{width:14px;height:14px;transition:transform .18s}",
				".dsh-qa-list{box-sizing:border-box;list-style:none;margin:0;padding:6px;gap:2px;flex-direction:column;display:flex;overflow-y:auto}",
				".dsh-qa-item{box-sizing:border-box;width:100%;min-height:40px;color:var(--dsw-alias-label-secondary);text-align:left;cursor:pointer;background:0 0;border:none;border-radius:9px;align-items:flex-start;gap:8px;padding:6px 8px;display:flex;transition:background .12s, color .12s}",
				".dsh-qa-item:hover{background:var(--dsw-alias-interactive-bg-hover)}",
				".dsh-qa-itemActive{color:var(--dsw-alias-label-primary);background:var(--dsw-alias-interactive-bg-hover)}",
				".dsh-qa-itemActive .dsh-qa-itemIndex{color:var(--dsw-alias-state-business-primary)}",
				".dsh-qa-itemIndex{flex:none;min-width:18px;height:18px;color:var(--dsw-alias-label-caption);border-radius:5px;align-items:center;justify-content:center;margin-top:1px;font-size:11px;line-height:18px;font-variant-numeric:tabular-nums;display:flex;transition:color .12s}",
				".dsh-qa-itemText{min-width:0;flex:1;font-size:12px;line-height:18px;word-break:break-word;display:-webkit-box;-webkit-box-orient:vertical;-webkit-line-clamp:3;overflow:hidden}",
				".dsh-qa-empty{color:var(--dsw-alias-label-tertiary);font-size:12px;line-height:18px;padding:10px 12px}",
				".dsh-qa-foot{flex:none;color:var(--dsw-alias-label-caption);border-top:1px solid var(--dsw-alias-border-l1);padding:6px 14px;font-size:11px;line-height:16px}",
				/* click flash on the scrolled-to chat row */
				".dsh-qa-flash{box-shadow:0 0 0 2px var(--dsw-alias-state-business-primary);border-radius:12px;transition:box-shadow .25s}"
			].join("\n");
			document.head.appendChild(tag);
		}

		// ── data helpers ─────────────────────────────────────────────────────────
		/**
		 * Extract a human-readable preview of one user-authored chat node. The
		 * node.data is the UserMessageNode / SteeringMessageNode shape
		 * ({kind, seq, time, content, ...}); image-only messages fall back to a
		 * localized placeholder.
		 */
		function textOfUserNode(node, t) {
			const data = node && node.data;
			const blocks = data && Array.isArray(data.content) ? data.content : [];
			let text = "";
			let hasImage = false;
			for (const block of blocks) {
				if (block && block.type === "text" && typeof block.text === "string") {
					if (text !== "") text += "\n";
					text += block.text;
				} else if (block && block.type === "image") {
					hasImage = true;
				}
			}
			text = text.trim();
			if (text === "" && hasImage) return t("imageOnly");
			return text;
		}

		/**
		 * The ordered list of user questions in the current conversation. Both
		 * `user` (ordinary prompts) and `steering` (next-step messages admitted
		 * while a turn is running) are user-authored and rendered through the
		 * same UserMessageNodeView, so both become anchors.
		 * @param snapshot - the current ConversationSnapshot (or null).
		 * @param t - bound translator.
		 */
		function anchorsOf(snapshot, t) {
			if (!snapshot || !snapshot.chat || !snapshot.chat.nodes || !snapshot.chat.order) return [];
			const out = [];
			for (const key of snapshot.chat.order) {
				const node = snapshot.chat.nodes.get(key);
				if (!node) continue;
				if (node.kind !== "user" && node.kind !== "steering") continue;
				const data = node.data;
				out.push({
					key,
					text: textOfUserNode(node, t) || "(…)",
					time: data && typeof data.time === "number" ? data.time : void 0
				});
			}
			return out;
		}

		/** The chat scroll container (ConversationRoot.scrollBody). */
		function scrollerOf() {
			return document.querySelector("[data-conversation-scroll]");
		}

		/** Find an already-rendered chat row by its Context key. */
		function rowOf(key) {
			for (const el of document.querySelectorAll("[data-chat-anchor-key]")) {
				if (el.dataset.chatAnchorKey === key) return el;
			}
			return null;
		}

		/** Row position inside the scrollport (viewport-independent). */
		function flowTop(row, scroller) {
			return row.getBoundingClientRect().top - scroller.getBoundingClientRect().top + scroller.scrollTop;
		}

		/**
		 * Right offset for the floating panel: keep it clear of the details
		 * column when that panel is open (AppFrame marks the frame with
		 * `data-details-collapsed` whenever details is not closed; the rendered
		 * width of the details slot wrapper is the measured column width).
		 */
		function measureRightOffset() {
			const overlay = document.querySelector("[data-shell-overlay]");
			const frame = overlay && overlay.parentElement;
			if (!frame) return 12;
			if (frame.hasAttribute("data-details-collapsed")) {
				const details = frame.querySelector('[data-slot="details"]');
				if (details) {
					const width = details.getBoundingClientRect().width;
					if (width > 0) return width + 12;
				}
			}
			return 12;
		}

		// ── the anchor panel component ────────────────────────────────────────────
		/**
		 * Floating right-side panel listing every user question in the current
		 * conversation. Clicking an item smoothly scrolls the chat to that
		 * message and briefly flashes the row; scrolling updates the active
		 * item (scroll-spy). Collapsed to a pill, it keeps a live question
		 * count badge.
		 *
		 * @param props - root-scope standard kit (`useSessions`) plus the
		 *   injected `sessionSnapshot(id)` face and the `t` locale seat.
		 */
		const QuestionAnchorsPanel = (props) => {
			const { sessionSnapshot, useSessions, t } = props;
			const currentId = useSessions((s) => s.current);

			/* Subscribe to the current session's ConversationSnapshot through
			 * its ObservableSnapshot face (the same source useSession reads),
			 * resolving the binding lazily per subscribe/getSnapshot call. */
			const subscribe = react.useCallback((cb) => {
				const face = currentId === void 0 ? void 0 : sessionSnapshot(currentId);
				return face === void 0 ? () => {} : face.subscribe(cb);
			}, [sessionSnapshot, currentId]);
			const getSnapshot = react.useCallback(() => {
				const face = currentId === void 0 ? void 0 : sessionSnapshot(currentId);
				return face === void 0 ? null : face.getSnapshot();
			}, [sessionSnapshot, currentId]);
			/* The same snapshot serves server rendering (uSES demands a third
			 * argument there; the browser never calls it). */
			const snapshot = react.useSyncExternalStore(subscribe, getSnapshot, getSnapshot);

			const anchors = react.useMemo(() => anchorsOf(snapshot, t), [snapshot, t]);
			const [open, setOpen] = react.useState(true);
			const [active, setActive] = react.useState(null);
			const [right, setRight] = react.useState(12);
			const flashTimer = react.useRef(null);

			/* Keep the panel clear of the details column; re-measure on frame
			 * resize / geometry changes. */
			react.useEffect(() => {
				const overlay = document.querySelector("[data-shell-overlay]");
				const frame = overlay && overlay.parentElement;
				if (!frame) return;
				const measure = () => setRight(measureRightOffset());
				measure();
				const ro = new ResizeObserver(measure);
				ro.observe(frame);
				return () => ro.disconnect();
			}, []);

			/* Scroll-spy: while the card is open, track which user question is
			 * nearest the read position and highlight it. */
			react.useEffect(() => {
				if (!open) return;
				const scroller = scrollerOf();
				if (!scroller) return;
				let raf = 0;
				const update = () => {
					raf = 0;
					const viewTop = scroller.getBoundingClientRect().top;
					const probe = viewTop + 148;
					let best = null;
					for (const anchor of anchors) {
						const row = rowOf(anchor.key);
						if (!row) continue;
						if (row.getBoundingClientRect().top <= probe) best = anchor.key;
					}
					setActive(best);
				};
				const onScroll = () => {
					if (raf) return;
					raf = requestAnimationFrame(update);
				};
				scroller.addEventListener("scroll", onScroll, { passive: true });
				update();
				return () => {
					scroller.removeEventListener("scroll", onScroll);
					if (raf) cancelAnimationFrame(raf);
				};
			}, [open, anchors, currentId]);

			/* Scroll the chat to one question and flash its row. */
			const scrollToAnchor = react.useCallback((key) => {
				const scroller = scrollerOf();
				const row = rowOf(key);
				if (!scroller || !row) return;
				const top = flowTop(row, scroller);
				scroller.scrollTo({ top: Math.max(top - 14, 0), behavior: "smooth" });
				setActive(key);
				if (flashTimer.current !== null) {
					clearTimeout(flashTimer.current);
					flashTimer.current = null;
				}
				row.classList.add("dsh-qa-flash");
				flashTimer.current = setTimeout(() => {
					row.classList.remove("dsh-qa-flash");
					flashTimer.current = null;
				}, 1600);
			}, []);

			react.useEffect(() => () => {
				if (flashTimer.current !== null) clearTimeout(flashTimer.current);
			}, []);

			if (currentId === void 0 || anchors.length === 0) return null;

			if (!open) {
				return react_jsx_runtime.jsx("div", {
					className: "dsh-qa-anchors",
					style: { right },
					"data-dsh-qa-open": "false",
					children: react_jsx_runtime.jsxs("button", {
						type: "button",
						className: "dsh-qa-pill",
						title: t("expand"),
						"aria-label": t("expand"),
						onClick: () => setOpen(true),
						children: [react_jsx_runtime.jsx("svg", {
							className: "dsh-qa-chevron",
							width: 14,
							height: 14,
							viewBox: "0 0 16 16",
							fill: "none",
							children: react_jsx_runtime.jsx("path", {
								d: "M3 5.5 8 10.5 13 5.5",
								stroke: "currentColor",
								strokeWidth: 1.6,
								strokeLinecap: "round",
								strokeLinejoin: "round"
							})
						}), react_jsx_runtime.jsx("span", {
							className: "dsh-qa-pillCount",
							children: String(anchors.length)
						})]
					})
				});
			}

			return react_jsx_runtime.jsx("div", {
				className: "dsh-qa-anchors",
				style: { right },
				"data-dsh-qa-open": "true",
				role: "complementary",
				"aria-label": t("title"),
				children: react_jsx_runtime.jsxs("div", {
					className: "dsh-qa-card",
					children: [
						react_jsx_runtime.jsxs("div", {
							className: "dsh-qa-header",
							children: [
								react_jsx_runtime.jsx("span", {
									className: "dsh-qa-title",
									children: t("title")
								}),
								react_jsx_runtime.jsx("span", {
									className: "dsh-qa-count",
									"aria-label": t("count", { count: anchors.length }),
									children: String(anchors.length)
								}),
								react_jsx_runtime.jsx("button", {
									type: "button",
									className: "dsh-qa-toggle",
									title: t("collapse"),
									"aria-label": t("collapse"),
									onClick: () => setOpen(false),
									children: react_jsx_runtime.jsx("svg", {
										className: "dsh-qa-chevron",
										width: 14,
										height: 14,
										viewBox: "0 0 16 16",
										fill: "none",
										children: react_jsx_runtime.jsx("path", {
											d: "M3 10.5 8 5.5 13 10.5",
											stroke: "currentColor",
											strokeWidth: 1.6,
											strokeLinecap: "round",
											strokeLinejoin: "round"
										})
									})
								})
							]
						}),
						react_jsx_runtime.jsx("ul", {
							className: "dsh-qa-list",
							children: anchors.map((anchor, index) => react_jsx_runtime.jsx("li", {
								children: react_jsx_runtime.jsxs("button", {
									type: "button",
									className: "dsh-qa-item" + (active === anchor.key ? " dsh-qa-itemActive" : ""),
									title: t("hint"),
									onClick: () => scrollToAnchor(anchor.key),
									children: [
										react_jsx_runtime.jsx("span", {
											className: "dsh-qa-itemIndex",
											children: String(index + 1)
										}),
										react_jsx_runtime.jsx("span", {
											className: "dsh-qa-itemText",
											children: anchor.text
										})
									]
								})
							}, anchor.key))
						}),
						react_jsx_runtime.jsx("div", {
							className: "dsh-qa-foot",
							children: t("hint")
						})
					]
				})
			});
		};

		// ── plugin body ──────────────────────────────────────────────────────────
		/**
		 * Client plugin body: register the dictionaries and seat the anchor
		 * panel in the shell overlay (a root-scoped list slot rendered by the
		 * layout shell), waiting for the layout declaration via slots.inject.
		 * The panel reads the current session's chat projection through the
		 * injected binding face — zero business state of its own.
		 * @param ctx - client root context.
		 */
		function apply(ctx) {
			ctx.effect(() => ctx.locale.register(NS, { zh, en }), "ui-question-anchors: dictionaries");
			ctx.slots.inject("shell.overlay", () => ctx.slots.register({
				name: "shell.overlay",
				id: "question-anchors",
				order: 100,
				locale: NS,
				inject: () => ({
					sessionSnapshot: (id) => {
						if (id === void 0) return void 0;
						return ctx.sessions.binding(id)?.session;
					}
				})
			}, QuestionAnchorsPanel));
		}

		exports.apply = apply;
		exports.inject = inject;
		return module.exports;
	}
});
