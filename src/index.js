import React, {useEffect, useState} from 'react'
import {render} from 'react-dom'
import {BrowserRouter, NavLink} from "react-router-dom"
import {Route, Switch} from "react-router"
import s from './index.module.css'

const Navigation = () => <nav className={s.nav}>
    <NavLink to="traditional" activeClassName={s.active}>
        Traditional
    </NavLink>
    <span>|</span>
    <NavLink to="scripted" activeClassName={s.active}>
        Scripted
    </NavLink>
</nav>

const Uri = ({uri, onChange}) => {
    return <form onSubmit={e => e.preventDefault()} className={s.uri}>
        <input
            type="text" value={uri} title="Mock Base URI"
            onChange={e => onChange(e.target.value)}/>
    </form>
}

const Traditional = ({postUri}) => <form
    action={postUri} method="POST" className={s.form}>
    <label>Username:<input
        id="username" type="text"/></label>
    <label>Password:<input
        id="password" type="password" autoComplete="password"/></label>
    <button type="submit">Login</button>
</form>

const Scripted = ({apiUri}) => {
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [state, setState] = useState('initial')

    const login = e => {
        e.preventDefault()
        const body = new URLSearchParams({username, password})
        fetch(`${apiUri}/login`, {method: 'POST', body})
            .then(response => {
                if (!response.ok) throw new Error('login failed')
            })
            .then(() => setState('loggedIn'))
            .catch(() => setState('error'))
    }

    switch (state) {
        case 'error':
            return <>
                <p>Login failed.</p>
                <button type="button" onClick={() => setState('initial')}>
                    Back
                </button>
            </>
        case 'loggedIn':
            return <>
                <p>Login successful.</p>
                <button type="button" onClick={() => setState('initial')}>
                    Back
                </button>
            </>
        default:
            return <form onSubmit={login} className={s.form}>
                <label>Username:<input
                    type="text" value={username}
                    onChange={e => setUsername(e.target.value)}/></label>
                <label>Password:<input
                    type="password" value={password} autoComplete="password"
                    onChange={e => setPassword(e.target.value)}/></label>
                <button type="submit">Login</button>
            </form>
    }
}

const Choose = () => <p>
    Choose traditional (pure HTML form) or scripted (pure JavaScript form).
</p>

const Ui = () => {
    const [uri, setUri] = useState('http://localhost:3000')
    useEffect(() => {
        const uri = window.localStorage.getItem('uri')
        if (uri) setUri(uri)
    }, [])

    const changeUri = uri => {
        window.localStorage.setItem('uri', uri)
        setUri(uri)
    }

    return <BrowserRouter>
        <header className={s.header}><Navigation/></header>
        <main className={s.main}>
            <Uri uri={uri} onChange={changeUri}/>
            <Switch>
                <Route path="/traditional"><Traditional postUri={uri}/></Route>
                <Route path="/scripted"><Scripted apiUri={uri}/></Route>
                <Route><Choose/></Route>
            </Switch>
        </main>
    </BrowserRouter>
}

// noinspection JSUnresolvedVariable
module.hot.accept(err => {
    if (err) console.error(err, 'Payment UI HMR failure');
});

render(<Ui/>, document.getElementById('root'))
