import { useEffect, useState } from "react"
import { data, useNavigate, useParams } from "react-router-dom"
import axiosClient from "../axios-client"
import { Link, Navigate, Outlet } from "react-router-dom";
import { useStateContext } from "../contexts/ContextProvider";

export default function UserForm() {
    const {id} = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [errors, setErrors] = useState(null)
    const [user, setUser] = useState({
        id: null,
        username: '',
        email: '',
        password: '',
        password_confirmation: ''
    })

    useEffect(() => {
        if (id) {
            setLoading(true)
            axiosClient.get(`/users/${id}`)
            .then(({ data }) => {
                setLoading(false)
                setUser(data)
            })
            .catch(() => {
                setLoading(false)
            })
        }
    }, [id])
    

    const onSubmit = (ev) => {
        ev.preventDefault();

        if(user.id) {
            axiosClient.put(`/users/${user.id}`, user)
            .then(() => {
                navigate('/users')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })

        } else {
            axiosClient.put(`/users`, user)
            .then(() => {
                navigate('/users')
            })
            .catch(err => {
                const response = err.response;
                if (response && response.status === 422) {
                    setErrors(response.data.errors)
                }
            })
        }
    }

    return (
        <>
        {user.id && <h1>Update User: {user.username} </h1>}
        {!user.id && <h1>New User</h1>}
        <div className="card animated fadeInDown">
            {loading && (
                <div className="text-center">Loading...</div>
            )}
            {errors && <div className="alert">
                {Object.keys(errors).map(key => (
                    <p key={key}>{errors[key][0]}</p>
                ))}
                </div>
            }
            {!loading &&
             <form onSubmit={onSubmit}>
                <input type="text" value={user.username} onChange={ev =>setUser({...user, username: ev.target.value})} placeholder="Username" />
                <input type="email" value={user.email} onChange={ev => setUser({...user, email: ev.target.value})} placeholder="Email" />
                <input type="Password" onChange={ev => setUser({...user, password: ev.target.value})} placeholder="Password" />
                <input type="Password" onChange={ev => setUser({...user, password_confirmation: ev.target.value})} placeholder="Password Confirmation" />
                <button className="btn">Save</button>
             </form>
            }
        </div>
        </>
    )
}