import { useState } from 'react';
import { getAppsRoutes } from '../AppRoutes';

export const RootRoutes = () => {
  const isAuthed = useState(true);
  if (!isAuthed) {
    return null;
  }
  return getAppsRoutes();
};
