// import { Input } from '@/components/ui/input';
import React from 'react'

const Header = () => {
    return (
        <header className='w-full container'>
            <div className='flex gap-4 items-center'>
                {/* <Input className='flex w-full' /> */}
                <div className='flex w-full justify-end items-center gap-4 rounded-[8px]'>
                    avatar
                </div>
            </div>
        </header>
    )
}

export default Header;