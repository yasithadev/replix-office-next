import { makeLoginAPICall } from './LoginAPI';
import Authentication from './Authentication';

export async function loginService(email, password){
    try{
        const data = await makeLoginAPICall(email, password);
        // Populate the singleton so any component/page can call
        // Authentication.getInstance().hasPermission(...) afterwards
        Authentication.getInstance(data.token, data.permissions ?? []);
        return data;
    }
    catch(err){
        throw err;
    }
}