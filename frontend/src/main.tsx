import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import RecipeApp from './api/claude_recipe'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RecipeApp />
  </StrictMode>,
)
