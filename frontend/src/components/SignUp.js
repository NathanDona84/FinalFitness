import React from "react";
function SignUpForm() {

    var email;
    var password;
    var firstName;
    var lastName;

    const [message, setMessage] = React.useState('');

    const doSignUp = async event => {
        event.preventDefault();
        console.log("inside doSignUp")
        var obj = {
            Login: email.value, Password: password.value, FirstName: firstName.value,
            LastName: lastName.value, UserId: Date.now()
        };
        console.log(`login: ${obj.Login} password: ${obj.Password} userID: ${obj.UserId}`);
        var js = JSON.stringify(obj);
        console.log(`JS: ${js}`);
        try {
            const response = await fetch('http://localhost:5000/api/signup',
                {
                    method: 'POST', body: js, headers: {
                        'Content-Type':
                            'application/json'
                    }
                });
            var res = JSON.parse(await response.text());
            console.log(res);
            if (res.id <= 0) {
                setMessage('User/Password combination incorrect');
            }
            else {
                var user =
                    { firstName: res.firstName, lastName: res.lastName, id: res.id }
                localStorage.setItem('user_data', JSON.stringify(user));
                setMessage('');
                //window.location.href = '/cards';
            }
        }
        catch (e) {
            alert(e.toString());
            return;
        }
    };

    return (
        <div className="form-container sign-up-container">
            <form onSubmit={doSignUp}>
                <h1>Create Account</h1>
                <span>or use your email for registration</span>
                <label>First Name</label>
                <input
                    type="text"
                    name="fname"
                    ref={(c) => firstName = c}
                    placeholder="First Name"
                />
                <label>Last Name</label>
                <input
                    type="text"
                    name="lname"
                    ref={(c) => lastName = c}
                    placeholder="Last Name"
                />
                <label>Email:</label>
                <input
                    type="email"
                    name="email"
                    ref={(c) => email = c}
                    placeholder="Email"
                />
                <label>Password</label>
                <input
                    type="password"
                    name="password"
                    ref={(c) => password = c}
                    placeholder="Password"
                />
                <button onClick={doSignUp}>Sign Up</button>
            </form>
        </div>
    );
}

export default SignUpForm;
