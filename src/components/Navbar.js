import React from 'react';
import Select from 'react-select';

const Navbar = ({ language, setLanguage, theme,
    setTheme, fontSize, setFontSize }) => {
    const languages = [
        { value: "c", label: "C" },
        { value: "cpp", label: "C++" },
        { value: "python", label: "Python" },
        { value: "java", label: "Java" },
    ];
    const themes = [
        { value: "vs-dark", label: "Dark" },
        { value: "light", label: "Light" },
    ]

    return (
        <div className=''>
            <h1>Code Room</h1>
            <Select options={languages} value={language}
                onChange={(e) => setLanguage(e.value)}
                placeholder={language} />
            <Select options={themes} value={theme}
                onChange={(e) => setTheme(e.value)}
                placeholder={theme} />
            <label>Font Size</label>
            <input type="range" min="18" max="30"
                value={fontSize} step="2"
                onChange={(e) => { setFontSize(e.target.value) }} />
        </div>
    )
}

export default Navbar
