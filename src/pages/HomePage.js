import React, { useState } from 'react';
import logo from '../logo.gif';
import Popup from 'reactjs-popup';
import CreateRoom from '../components/CreateRoom';
import JoinRoom from '../components/JoinRoom';

function HomePage() {
    const [openPopup1, setOpenPopup1] = useState(false);
    const [openPopup2, setOpenPopup2] = useState(false);
    const closePopup1 = () => setOpenPopup1(false);
    const closePopup2 = () => setOpenPopup2(false);

    return (
        <div className='relative h-screen bg-black'>
            <img className='w-[50%] px-5' src={logo} alt='logo' />
            <div className='absolute top-[40%] right-[10%] flex flex-col space-y-5'>
                <button type='button'
                    className='bg-gray-300 hover:bg-gray-400 text-lg font-bold px-12 py-3 rounded'
                    onClick={() => setOpenPopup1(o => !o)}>Create a Room
                </button>
                <Popup open={openPopup1} onClose={closePopup1}>
                    <div className='absolute -top-24 -left-10'>
                        <CreateRoom closePopup={closePopup1} />
                    </div>
                </Popup>
                <button type='button'
                    className='bg-yellow-400 hover:bg-yellow-500 text-lg font-bold px-12 py-3 rounded'
                    onClick={() => setOpenPopup2(o => !o)}>Join a Room
                </button>
                <Popup open={openPopup2} onClose={closePopup2}>
                    <div className='absolute -top-24 -left-10'>
                        <JoinRoom closePopup={closePopup2} />
                    </div>
                </Popup>
            </div>
        </div>
    )
}

export default HomePage;