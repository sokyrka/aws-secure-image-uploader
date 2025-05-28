import { Amplify } from 'aws-amplify';

Amplify.configure({
    Auth: {
        region: import.meta.env.REGION,
        userPoolId: import.meta.env.COGNITO_USER_POOL_ID,
        userPoolWebClientId: import.meta.env.COGNITO_CLIENT_ID,
        mandatorySignIn: true,
        authenticationFlowType: 'USER_PASSWORD_AUTH',
    }
});
