import asyncRoute from '../lib/asyncComponent';

export const Home = asyncRoute(()=>import('./Home'));
export const Chat = asyncRoute(()=>import('./Chat'));
export const NoMatch = asyncRoute(()=>import('./NoMatch'));