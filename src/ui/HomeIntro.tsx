import { Icon } from '@salesforce/design-system-react';
import '../styles/homeIntro.css';

const steps = [
  {
    number: 1,
    href: 'https://developer.salesforce.com/docs/platform/lightning-component-reference',
    prefix: 'Start with ',
    linkText: 'Lightning Base Components',
    suffix: '',
    body: (
      <>
        <strong>Always</strong> start with Lightning Base Components first. When talking with an
        agent, name these components directly (for example, <code>lightning-button</code>).
      </>
    ),
  },
  {
    number: 2,
    href: 'https://v1.lightningdesignsystem.com/components/activity-timeline/',
    prefix: 'Use ',
    linkText: 'Component Blueprints',
    suffix: ' when needed',
    body: (
      <>
        If you cannot find what you need from Lightning Base Components, create a new LWC from a
        Component Blueprint, replacing as much markup with Lightning Base Components as possible.
      </>
    ),
  },
  {
    number: 3,
    href: 'https://www.lightningdesignsystem.com/2e1ef8501/p/591960-global-styling-hooks/b/40abde',
    prefix: 'Build custom with ',
    linkText: 'Global Styling Hooks',
    suffix: '',
    body: (
      <>
        If you cannot find what you need as a Lightning Base Component or Component Blueprint,
        create a custom component using Global Styling Hooks.
      </>
    ),
  },
];

export default function HomeIntro() {
  return (
    <section className="slds-p-horizontal_small slds-p-vertical_medium">
      <header className="slds-m-bottom_large">
        <h1 className="slds-text-heading_large slds-m-bottom_x-small">
          Welcome to the Salesforce UI Starter Kit
        </h1>
        <p className="slds-text-body_regular intro-copy">
          Use this to prototype and build off-platform experiences with SLDS and Lightning Base
          Components.
        </p>
      </header>

      <h2 className="slds-text-heading_medium slds-m-bottom_medium">Where to Find Components</h2>

      <div role="list">
        {steps.map((step, index) => (
          <div
            key={step.number}
            className={`slds-grid slds-grid_vertical-align-start${index < steps.length - 1 ? ' slds-m-bottom_medium' : ''}`}
            role="listitem"
          >
            <div className="intro-step-number-column slds-m-right_small">
              <span className="intro-step-number" aria-hidden="true">
                {step.number}
              </span>
            </div>
            <div className="slds-col">
              <h3 className="slds-text-heading_small slds-m-bottom_xx-small">
                {step.prefix}
                <a
                  className="intro-title-link"
                  href={step.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {step.linkText}
                  <Icon
                    category="utility"
                    name="new_window"
                    size="xx-small"
                    assistiveText={{ label: 'Opens in a new tab' }}
                    className="intro-link-icon slds-m-left_xx-small"
                  />
                </a>
                {step.suffix}
              </h3>
              <p className="slds-text-body_regular intro-copy">{step.body}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
