export default function Placeholder({ title }: { title: string }) {
  return (
    <div className="slds-p-around_large slds-text-align_center slds-text-color_weak">
      <h1 className="slds-text-heading_large">{title}</h1>
      <p className="slds-m-top_small">This page is not built yet in the React vertical slice.</p>
    </div>
  );
}
