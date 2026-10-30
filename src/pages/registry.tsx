import type { ComponentType } from 'react';
import Home from './Home';
import Icons from './Icons';
import Contacts from './Contacts';
import ContactDetail from './ContactDetail';
import Builder from './Builder';

export type PageProps = {
  params: Record<string, string>;
  navigate: (path: string) => void;
  onExit?: () => void;
};

export const ROUTE_COMPONENTS: Record<string, ComponentType<PageProps>> = {
  'page-home': Home,
  'page-icon-test': Icons,
  'page-contacts': Contacts,
  'page-contact-detail': ContactDetail,
  'page-builder': Builder,
};
