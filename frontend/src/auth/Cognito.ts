import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: import.meta.env.VITE_REGION,
        userPoolId: import.meta.env.VITE_COGNITO_USER_POOL_ID,
        userPoolWebClientId: import.meta.env.VITE_COGNITO_CLIENT_ID,
        mandatorySignIn: true,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    }
});
