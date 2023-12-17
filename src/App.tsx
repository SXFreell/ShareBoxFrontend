import { Route, Routes } from "react-router-dom"
import Home from "@pages/Home.tsx"
import Login from "@pages/Login.tsx"
import NotFoundPage from "@/pages/404.tsx"
import { Button } from "@douyinfe/semi-ui"
import { IconMoon, IconSun } from "@douyinfe/semi-icons"
import { useState } from "react"

const darkMode = localStorage.getItem('theme-mode') === 'dark';
if (darkMode) {
  document.body.setAttribute('theme-mode', 'dark');
} else {
  document.body.removeAttribute('theme-mode');
}

function App() {
  const body = document.body;
  const [icon, setIcon] = useState<JSX.Element>(
    body.hasAttribute('theme-mode')
      ? <IconSun />
      : <IconMoon />
  );

  const changeTheme = (): void => {
    if (body.hasAttribute('theme-mode')) {
      body.removeAttribute('theme-mode');
      localStorage.setItem('theme-mode', 'light');
      setIcon(<IconMoon />);
    } else {
      body.setAttribute('theme-mode', 'dark');
      localStorage.setItem('theme-mode', 'dark');
      setIcon(<IconSun />);
    }
  }

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      <div className="float-buttons">
        <Button icon={icon} onClick={changeTheme} className="float-button"></Button>
      </div>
    </>
  )
}

export default App
