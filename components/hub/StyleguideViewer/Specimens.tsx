"use client";

import { getComponent } from "@/components/registry";

/**
 * Every variant of one real component, straight from its states file. Takes the
 * registry id — the component's name in lower case.
 *
 * A client component because states files pass event handlers as props, and
 * those cannot cross from a server component into the real component. The
 * component catalogue is client-side for the same reason.
 */
export function Specimens({ id }: { id: string }) {
  const component = getComponent(id);
  if (!component) return null;

  return (
    <div className="styleguide__group">
      <h3 className="styleguide__group-title">{component.name}</h3>
      <p className="styleguide__group-note">{component.description}</p>
      <ul className="styleguide__specimens">
        {component.variants.map((variant) => (
          <li className="styleguide__specimen" key={variant.label}>
            <p className="styleguide__specimen-label">{variant.label}</p>
            <div className={`catalogue__stage catalogue__stage--${component.surface}`}>
              {variant.element}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
