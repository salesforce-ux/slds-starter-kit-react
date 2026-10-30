import { Icon, Button } from '@salesforce/design-system-react';

// Mirrors the LWC `page/notFound` template: a small centered illustration
// (utility:error), "Page Not Found" heading, body copy, and a brand
// "Go to Home" button. Rendered by App.tsx as the route fallback in place of
// the generic dev-slice Placeholder.
// App.tsx renders every route Outlet with `params` + `navigate`; accept (and
// ignore) `params` so the shared call site type-checks against this page too.
export default function NotFound({
  navigate,
}: {
  params?: Record<string, string>;
  navigate?: (path: string) => void;
}) {
  return (
    <div className="slds-illustration slds-illustration_small slds-p-around_x-large slds-text-align_center">
      <div className="slds-m-bottom_medium">
        <Icon category="utility" name="error" size="large" assistiveText={{ label: 'Page not found' }} />
      </div>
      <h2 className="slds-text-heading_medium slds-m-bottom_small">Page Not Found</h2>
      <p className="slds-text-body_regular slds-m-bottom_medium">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button label="Go to Home" variant="brand" onClick={() => navigate?.('/')} />
    </div>
  );
}
