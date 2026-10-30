import { useEffect, useRef, useState } from 'react';
import { Card, Badge, Button, Icon } from '@salesforce/design-system-react';
import '../styles/icons.css';

// DSR's `Icon` component types `category` as a union, not a plain string,
// but the package only exports components from its root — not the
// `IconCategory` type itself — so we mirror the union locally rather than
// deep-importing an internal path or falling back to `as any`.
type IconCategoryName = 'action' | 'custom' | 'doctype' | 'standard' | 'utility';

const STANDARD = ['account','contact','lead','opportunity','case','task','event','campaign','dashboard','report','user','knowledge','product','file','people','announcement','approval','bot','forecasts','goals','hierarchy','orders','settings','survey'];
const UTILITY = ['add','attach','check','close','copy','delete','download','edit','email','error','favorite','filter','home','info','link','lock','new_window','notification','refresh','search','settings','share','success','warning','arrow_left','arrow_right','bookmark','call','chart','clock','database','desktop','expand','feed','help','image','key','list','logout','palette','play','preview','print','redo','undo','upload','user','video','world'];
const DOCTYPE = ['csv','excel','image','pdf','ppt','txt','word','xml','zip','attachment','html','mp4','gdoc','gsheet','rtf','video','unknown'];

const TOTAL = STANDARD.length + UTILITY.length + DOCTYPE.length;

function IconGrid({ category, names }: { category: IconCategoryName; names: string[] }) {
  return (
    <div className="icon-grid">
      {names.map((name) => (
        <div key={name} className="icon-item">
          <Icon category={category} name={name} size="small" />
          <span className="icon-item__label">{name}</span>
        </div>
      ))}
    </div>
  );
}

export default function Icons() {
  const start = useRef(performance.now());
  const [renderMs, setRenderMs] = useState<string>('—');
  useEffect(() => { setRenderMs(`${(performance.now() - start.current).toFixed(1)} ms`); }, []);

  return (
    <div className="page">
      <div className="page-header">
        <div className="page-header__title">
          <span className="slds-text-heading_large">Icon Test Page</span>
          <span className="slds-text-body_regular page-header__subtitle">
            {TOTAL} icons · render time: {renderMs}
          </span>
        </div>
        <Button
          variant="brand"
          label="Browse Full Icon Library"
          iconCategory="utility"
          iconName="new_window"
          iconPosition="right"
          onClick={() => window.open('https://v1.lightningdesignsystem.com/icons/', '_blank')}
        />
      </div>
      <div className="page-body">
        <Card heading="Standard" className="slds-m-bottom_medium" headerActions={<Badge content={String(STANDARD.length)} />}>
          <IconGrid category="standard" names={STANDARD} />
        </Card>
        <Card heading="Utility" className="slds-m-bottom_medium" headerActions={<Badge content={String(UTILITY.length)} />}>
          <IconGrid category="utility" names={UTILITY} />
        </Card>
        <Card heading="Doctype" className="slds-m-bottom_medium" headerActions={<Badge content={String(DOCTYPE.length)} />}>
          <IconGrid category="doctype" names={DOCTYPE} />
        </Card>
      </div>
    </div>
  );
}
