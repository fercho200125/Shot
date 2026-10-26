import { useRef, type KeyboardEvent } from 'react';
import { menuTabs, productsInTab, type TabId } from '../data/menu';
import './CategoryTabs.css';

interface Props {
  active: TabId;
  onChange: (id: TabId) => void;
}

export const tabId = (id: TabId) => `tab-${id}`;
export const panelId = (id: TabId) => `panel-${id}`;

export function CategoryTabs({ active, onChange }: Props) {
  const refs = useRef<Partial<Record<TabId, HTMLButtonElement | null>>>({});

  const onKeyDown = (e: KeyboardEvent) => {
    const index = menuTabs.findIndex((t) => t.id === active);
    const last = menuTabs.length - 1;
    const next =
      e.key === 'ArrowRight' ? (index === last ? 0 : index + 1)
      : e.key === 'ArrowLeft' ? (index === 0 ? last : index - 1)
      : e.key === 'Home' ? 0
      : e.key === 'End' ? last
      : null;
    if (next === null) return;
    e.preventDefault();
    const id = menuTabs[next]!.id;
    onChange(id);
    refs.current[id]?.focus();
  };

  return (
    <div className="tabs" role="tablist" aria-label="Categorías del menú" onKeyDown={onKeyDown}>
      {menuTabs.map((c) => {
        const selected = c.id === active;
        return (
          <button
            key={c.id}
            ref={(el) => {
              refs.current[c.id] = el;
            }}
            type="button"
            role="tab"
            id={tabId(c.id)}
            aria-selected={selected}
            aria-controls={panelId(c.id)}
            tabIndex={selected ? 0 : -1}
            className="tabs__tab"
            onClick={() => onChange(c.id)}
          >
            {c.name}
            <span className="tabs__count" aria-hidden="true">
              {productsInTab(c).length}
            </span>
          </button>
        );
      })}
    </div>
  );
}
