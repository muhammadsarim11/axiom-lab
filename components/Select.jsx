"use client";

import { useEffect, useId, useRef, useState } from "react";
import { CheckIcon, ChevronDown } from "./Icons";

/**
 * Accessible custom dropdown (ARIA select-only combobox) styled to match the site.
 * Single or multi-select; renders hidden inputs so it also works in a plain <form>.
 */
export default function Select({
  label,
  name,
  options,
  value,
  onChange,
  placeholder = "Select",
  multiple = false,
  hint,
  error,
}) {
  const id = useId();
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const selected = multiple ? value : value ? [value] : [];
  const display = multiple ? value.join(", ") : value;

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (event) => {
      if (!rootRef.current?.contains(event.target)) setOpen(false);
    };
    document.addEventListener("pointerdown", onPointerDown);
    return () => document.removeEventListener("pointerdown", onPointerDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.children[active]?.scrollIntoView({ block: "nearest" });
  }, [open, active]);

  const openList = () => {
    const first = options.findIndex((option) => selected.includes(option));
    setActive(first === -1 ? 0 : first);
    setOpen(true);
  };

  const choose = (option) => {
    if (multiple) {
      onChange(value.includes(option) ? value.filter((v) => v !== option) : [...value, option]);
    } else {
      onChange(option);
      setOpen(false);
    }
  };

  const onKeyDown = (event) => {
    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.min(i + 1, options.length - 1));
        break;
      case "ArrowUp":
        event.preventDefault();
        if (!open) openList();
        else setActive((i) => Math.max(i - 1, 0));
        break;
      case "Home":
        if (open) {
          event.preventDefault();
          setActive(0);
        }
        break;
      case "End":
        if (open) {
          event.preventDefault();
          setActive(options.length - 1);
        }
        break;
      case "Enter":
      case " ":
        event.preventDefault();
        if (open) choose(options[active]);
        else openList();
        break;
      case "Escape":
        if (open) {
          event.preventDefault();
          setOpen(false);
        }
        break;
      case "Tab":
        setOpen(false);
        break;
      default:
    }
  };

  return (
    <div className={`field${error ? " has-error" : ""}`} ref={rootRef}>
      <span className="field-label" id={`${id}-label`}>
        {label}
        {hint && <em>{hint}</em>}
      </span>
      <button
        type="button"
        role="combobox"
        id={`${id}-button`}
        className={`select-button${open ? " is-open" : ""}${display ? "" : " is-empty"}`}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={`${id}-list`}
        aria-labelledby={`${id}-label ${id}-button`}
        aria-activedescendant={open ? `${id}-option-${active}` : undefined}
        aria-invalid={error ? true : undefined}
        aria-describedby={error ? `${id}-error` : undefined}
        onClick={() => (open ? setOpen(false) : openList())}
        onKeyDown={onKeyDown}
      >
        <span className="select-value">{display || placeholder}</span>
        <ChevronDown size={18} />
      </button>

      {open && (
        <ul
          className="select-list"
          role="listbox"
          id={`${id}-list`}
          aria-labelledby={`${id}-label`}
          aria-multiselectable={multiple || undefined}
          ref={listRef}
          data-lenis-prevent
        >
          {options.map((option, index) => {
            const isSelected = selected.includes(option);
            return (
              <li
                key={option}
                id={`${id}-option-${index}`}
                role="option"
                aria-selected={isSelected}
                className={`select-option${index === active ? " is-active" : ""}${isSelected ? " is-selected" : ""}`}
                onPointerDown={(event) => event.preventDefault()}
                onClick={() => choose(option)}
                onMouseEnter={() => setActive(index)}
              >
                <span>{option}</span>
                {isSelected && <CheckIcon size={16} />}
              </li>
            );
          })}
        </ul>
      )}

      {name &&
        (multiple ? (
          value.map((v) => <input type="hidden" name={name} value={v} key={v} />)
        ) : (
          <input type="hidden" name={name} value={value} />
        ))}

      {error && (
        <span className="field-error" id={`${id}-error`} role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
