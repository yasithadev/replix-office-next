import { makeLoginAPICall } from './LoginAPI';
import Authentication from './Authentication';

export async function loginService(email, password){
    try{
        const data = await makeLoginAPICall(email, password);
        // Populate the singleton so any component/page can call
        // Authentication.getInstance().hasPermission(...) afterwards
        console.log("data",data);
        console.log("data.response.roles",data.response.roles);
        console.log("data.response.token",data.response.token);
        let auth = Authentication.getInstance();
        auth.setJwt(data.response.token);
        auth.setPermissions(data.response.roles ?? []);
        console.log("Authentication.getInstance",Authentication.getInstance());
        return data;
    }
    catch(err){
        throw err;
    }
}