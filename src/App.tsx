import { Route, Routes } from "react-router-dom"
import Home from "@pages/Home/home"
import Login from "@pages/Login/login"
import NotFoundPage from "@pages/404/404"
import { Button } from "@arco-design/web-react"
import { IconMoon, IconSun } from "@arco-design/web-react/icon"
import { useState } from "react"

const iconStyle: React.CSSProperties = {
  fontSize: 24,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
}

const darkMode = localStorage.getItem('arco-theme') === 'dark';
if (darkMode) {
  document.body.setAttribute('arco-theme', 'dark');
} else {
  document.body.removeAttribute('arco-theme');
}

function App() {
  const body = document.body;
  const [icon, setIcon] = useState<JSX.Element>(
    body.hasAttribute('arco-theme')
      ? <IconSun style={iconStyle} />
      : <IconMoon style={iconStyle} />
  );

  const changeTheme = (): void => {
    if (body.hasAttribute('arco-theme')) {
      body.removeAttribute('arco-theme');
      localStorage.setItem('arco-theme', 'light');
      setIcon(<IconMoon style={iconStyle} />);
    } else {
      body.setAttribute('arco-theme', 'dark');
      localStorage.setItem('arco-theme', 'dark');
      setIcon(<IconSun style={iconStyle} />);
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
        <Button shape="circle" size="large" icon={icon} onClick={changeTheme} className="float-button"></Button>
      </div>
    </>
  )
}

export default App
