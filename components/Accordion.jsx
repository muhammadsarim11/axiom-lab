"use client";

import { useId, useState } from "react";
import { PlusIcon } from "./Icons";

/**
 * Single-open accordion. `header` and `content` are pre-rendered nodes, so content stays in the
 * HTML (good for SEO) and is only visually collapsed.
 */
export default function Accordion({ items, variant = "faq", defaultOpen = 0 }) {
  const baseId = useId();
  const [openId, setOpenId] = useState(items[defaultOpen]?.id ?? null);

  return (
    <div className={`accordion accordion-${variant}`} data-reveal-group>
      {items.map((item, index) => {
        const isOpen = openId === item.id;
        const panelId = `${baseId}-panel-${item.id}`;
        const buttonId = `${baseId}-button-${item.id}`;
        return (
          <div className={`acc-item${isOpen ? " is-open" : ""}`} key={item.id}>
            <h3 className="acc-heading">
              <button
                type="button"
                id={buttonId}
                className="acc-trigger"
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => setOpenId(isOpen ? null : item.id)}
              >
                <span className="acc-index">{String(index + 1).padStart(2, "0")}</span>
                <span className="acc-title">{item.header}</span>
                <span className="acc-icon">
                  <PlusIcon size={20} />
                </span>
              </button>
            </h3>
            <div className="acc-panel" id={panelId} role="region" aria-labelledby={buttonId}>
              <div className="acc-panel-inner">
                <div className="acc-content">{item.content}</div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
