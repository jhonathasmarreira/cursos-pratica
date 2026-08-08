import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { LuaApp } from './lua/LuaApp';
import './index.css';
import './lua/lua.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LuaApp />
  </StrictMode>
);
