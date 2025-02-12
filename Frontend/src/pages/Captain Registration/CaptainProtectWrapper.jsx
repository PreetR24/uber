import React, { useContext, useEffect, useState } from 'react'
import { CaptainDataContext } from '../../context/CaptainContext'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'

const CaptainProtectWrapper = ({
    children
}) => {
    const captainToken = localStorage.getItem('captainToken')
    const navigate = useNavigate()
    const { captain, setCaptain } = useContext(CaptainDataContext)
    const [ isLoading, setIsLoading ] = useState(true)

    useEffect(() => {
        if (!captainToken) {
            navigate('/captain-login')
        }

        axios.get(`${import.meta.env.VITE_BASE_URL}/captains/profile`, {
            headers: {
                Authorization: `Bearer ${captainToken}`
            }
        }).then(response => {
            if (response.status === 200) {
                setCaptain(response.data.captain);
                setIsLoading(false)
            }
        }).catch(err => {
            localStorage.removeItem('captainToken')
            navigate('/captain-login')
        })
    }, [ captainToken ])

    if (isLoading) {
        return (
            <div>Loading...</div>
        )
    }

    return (
        <>
            {children}
        </>
    )
}

export default CaptainProtectWrapper