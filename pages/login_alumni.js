import { useRouter } from "next/router"
import { useState } from "react"
import Head from "next/head"
import Swal from "sweetalert2"
import useLoginStore from "../store/store"
import { setCookie } from "../libs/cookies.lib"


export default function Login() {
  const router = useRouter()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    fetch(`/api/alumni/auth`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({nim: username, password: password})
    })
      .then(result => result.json())
      .then(res => {
        if (res.message === 'success') {
          useLoginStore.setState({
            username: res.data.nim,
            role: res.data.role
          })
          setCookie('user', JSON.stringify({isLoggedIn: true, username: res.data.nim, role: 'alumni'}), 1)
          router.push('/admin-pages/profile')
        } else {
          Swal.fire({
            icon: 'warning',
            title: 'Oops...',
            text: 'Username atau password salah!',
          })
        }
      })
      .catch((err) => {
        Swal.fire({
          icon: 'error',
          title: 'Oops...',
          text: "Can't connect to server...",
        })
        console.log(err)
      })
  }

  return (
    <div className="container">
      <Head>
        <title>Login Alumni - Tracer Study</title>
      </Head>
      <section className="section">
        <div className="container mt-5">
          <div className="row">
            <div className="col-12 col-sm-8 offset-sm-2 col-md-6 offset-md-3 col-lg-6 offset-lg-3 col-xl-4 offset-xl-4">
              <div className="card card-success">
                <div className="card-header"><h4>Login Alumni</h4></div>
                <div className="card-body">
                  <form onSubmit={handleSubmit} className="needs-validation" noValidate>
                    <div className="form-group">
                      <label htmlFor="text">Username</label>
                      <input id="text" type="text" className="form-control" name="text" value={username} onChange={(e) => setUsername(e.target.value)} tabIndex={1} required autoFocus />
                      <div className="invalid-feedback">
                        Please fill in your username
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="d-block">
                        <label htmlFor="password" className="control-label">Password</label>
                      </div>
                      <input id="password" type="password" className="form-control" name="password" value={password} onChange={(e) => setPassword(e.target.value)} tabIndex={2} required />
                      <div className="invalid-feedback">
                        Please fill in your password
                      </div>
                    </div>
                    <div className="form-group">
                      <button type="submit" className="btn btn-success btn-lg btn-block" tabIndex={4}>
                        Login
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

    </div>
  )
}