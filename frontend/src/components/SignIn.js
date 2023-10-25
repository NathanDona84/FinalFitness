import React from "react";
function SignInForm() {
    var email;
    var password;
    const [message, setMessage] = React.useState('');
    const [state, setState] = React.useState({
        email: "",
        password: ""
    });

    const doLogin = async event => {
        event.preventDefault();
        console.log("inside dologin")
        var obj = { email: email.value, password: password.value };
        console.log("obj passed: " + obj.email + obj.password);
        var js = JSON.stringify(obj);
        try {
            const response = await fetch('http://localhost:5000/api/login',
                {
                    method: 'POST', body: js, headers: {
                        'Content-Type':
                            'application/json'
                    }
                });
            var res = JSON.parse(await response.text());
            console.log(`result is ${res.id}`);
            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user =
                    { firstName: res.firstName, lastName: res.lastName, id: res._id }
                    console.log(user.id)
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                window.location.href = '/home';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div className="form-container sign-in-container">
            <form onSubmit={doLogin}>
                <h1>Sign in</h1>
                <span>or use your account</span>
                <label>Username</label>
                <input
                    type="text"
                    placeholder="Email"
                    name="email"
                    id="email"
                    ref={(c) => email = c}
                />
                <label>Password</label>
                <input
                    id="password"
                    type="password"
                    name="password"
                    d="password" 
                    placeholder="Password"
                    ref={(c) => password = c}
                />
                <a href="#">Forgot your password?</a>
                <button onClick={doLogin}>Sign In</button>
                <span id="loginResult">{message}</span>
            </form>
            
        </div>
    );
}

export default SignInForm;
