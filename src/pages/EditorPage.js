import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import Popup from 'reactjs-popup';
import UserList from '../components/UserList';
import Editor from "@monaco-editor/react";
import toast from 'react-hot-toast';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faCircleChevronLeft, faFileCode, faCode, faUserGroup, faWifi, faPersonWalkingArrowRight } from '@fortawesome/free-solid-svg-icons';
import { useNavigate, useLocation } from 'react-router-dom';

import io from "socket.io-client";
const startingCode = `#include <bits/stdc++.h>
using namespace std;

int main() {
  cout << "CodeSpace : A Real-Time Code Editor";
  return 0;
}`

let socket;
function EditorPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const [users, setUsers] = useState('');
    const [code, setCode] = useState(startingCode);
    const [language, setLanguage] = useState("cpp");
    const [theme, setTheme] = useState("vs-dark");

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

    useEffect(() => {
        socket = io(process.env.REACT_APP_BACKEND_URL);

        socket.emit("JOIN", {
            roomId: location.state.roomId,
            username: location.state.username,
        });

        socket.on("CODE-CHANGE", (code) => {
            setCode(code);
        });

        socket.on("LANGUAGE-CHANGE", (language) => {
            setLanguage(language);
        });

        socket.on("THEME-CHANGE", (theme) => {
            setTheme(theme);
        });

        socket.on("ROOM-DATA-CHANGE", ({ users }) => {
            setUsers(users);
            console.log(users);
        });

        socket.on("TOAST-NOTIFICATION", ({ text, type }) => {
            if (type === "Join") {
                toast(text, {
                    icon: <FontAwesomeIcon icon={faWifi} color='teal' />,
                });
            }
            if (type === "Leave") {
                toast(text, {
                    icon: <FontAwesomeIcon icon={faPersonWalkingArrowRight} color='red' />,
                });
            }
        });

        return () => {
            socket.close();
            socket.off("CODE-CHANGE", "LANGUAGE-CHANGE", "THEME-CHANGE", "ROOM-DATA-CHANGE", "TOAST-NOTIFICATION");
        }

    }, []);

    const onCodeChange = (code) => {
        socket.emit("CODE-CHANGE", code);
    };

    const onLanguageChange = (language) => {
        setLanguage(language);
        socket.emit("LANGUAGE-CHANGE", language);
    };

    const onThemeChange = (theme) => {
        setTheme(theme);
        socket.emit("THEME-CHANGE", theme);
    };

    const onLeave = () => {
        socket.emit("ROOM-LEAVE");
        navigate(`/`);
    }

    const onCopyRoomId = () => {
        navigator.clipboard.writeText(location.state.roomId);
        toast.success('Room ID copied to clipboard !', {
            icon: <FontAwesomeIcon icon={faCopy} color='teal' />,
        });
    };

    const onCopyCode = () => {
        navigator.clipboard.writeText(code);
        toast.success('Code copied to clipboard !', {
            icon: <FontAwesomeIcon icon={faCopy} color='teal' />,
        });
    };

    return (
        <div className='grid grid-flow-col h-screen bg-zinc-700'>
            <div className='flex justify-between flex-col pt-2 pb-8 items-center h-[100vh] bg-zinc-900'>
                <div className='flex flex-col space-y-3 items-center'>
                    <div className='flex flex-col space-y-1 items-center m-4 mb-6'>
                        <h1 className='text-xl text-white font-bold'>
                            <FontAwesomeIcon icon={faCode} /> &nbsp;
                            <span className='font-bold'>Code</span>
                            <span className='text-yellow-400'>Space</span> &nbsp;
                            <FontAwesomeIcon icon={faCode} />
                        </h1>
                        <h1 className='text-pink-400 text-xs'>A Real-Time Code Editor</h1>
                    </div>
                    <Popup
                        trigger={<button type='button' className=' hover:bg-zinc-600 bg-zinc-700 text-gray-300
                          font-bold px-4 py-2 rounded'><FontAwesomeIcon icon={faUserGroup} /> Participants [ {users.length} ]</button>}
                        position={'bottom center'}
                    >
                        <UserList users={users} />
                    </Popup>
                    <button type='button' onClick={onCopyRoomId} className='hover:bg-zinc-600 bg-zinc-700 text-gray-300 
                     font-bold px-8 py-2 rounded'><FontAwesomeIcon icon={faCopy} /> Room ID</button>
                </div>
                <button type='button' onClick={onLeave} className='bg-red-600 hover:bg-red-700 text-lg font-bold
                     text-gray-300 px-8 py-2 rounded'><FontAwesomeIcon icon={faCircleChevronLeft} /> Leave</button>
            </div>
            <div className='h-[90vh] w-[60vw] m-7 rounded'>
                <Editor
                    defaultLanguage="python"
                    theme={theme}
                    language={language}
                    defaultValue={startingCode}
                    value={code}
                    onChange={onCodeChange}
                />
            </div>
            <div className='h-[90vh] pr-10 pb-10 flex flex-col space-y-3 justify-end'>
                <div className='flex flex-col'>
                    <h1 className='text-white'>Language</h1>
                    <Select options={languages} value={language}
                        onChange={(e) => onLanguageChange(e.value)}
                        placeholder={language}
                    />
                </div>
                <div className='flex flex-col'>
                    <h1 className='text-white'>Theme</h1>
                    <Select options={themes} value={theme}
                        onChange={(e) => onThemeChange(e.value)}
                        placeholder={theme}
                    />
                </div>
                <button type='button' onClick={onCopyCode} className=' hover:bg-gray-300 hover:text-black text-white
                     m-5 px-2 py-1 border rounded'><FontAwesomeIcon icon={faFileCode} /> Copy</button>
            </div>
        </div >
    )
}

export default EditorPage;