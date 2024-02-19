import { GoogleLogin } from '@react-oauth/google';
function Login(){
    const responseMessage = (response) => {
        console.log(response);
    };
    const errorMessage = (error) => {
        console.log(error);
    };
    return (
        <div>
            <h1>Login</h1>
            <GoogleLogin
  onSuccess={credentialResponse => {
    console.log(credentialResponse);
  }}
  onError={() => {
    console.log('Login Failed');
  }}></GoogleLogin>

        </div>
    );

}
export default Login;