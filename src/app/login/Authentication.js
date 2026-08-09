class Authentication {
    #jwt;
    #permissions;
  
    constructor(jwt, permissions) {
      if (!Authentication.instance) {//make the class singleton
        this.#jwt = jwt;
        this.#permissions = permissions;
        Authentication.instance = this;
      }
      return Authentication.instance;
    }
    // Static method to get the singleton instance
    static getInstance(jwt = '', permissions = []) {
      if (!Authentication.instance) {
        Authentication.instance = new Authentication(jwt, permissions);
      }
      return Authentication.instance;
    }
    // Getter for jwt
    getJwt() {
      return this.#jwt;
    }
  
    // Setter for jwt
    setJwt(jwt) {
      this.#jwt = jwt;
    }
  
    // Getter for permissions
    getPermissions() {
      return this.#permissions;
    }
  
    // Setter for permissions
    setPermissions(permissions) {
      this.#permissions = permissions;
    }
    
    // Check if the user has a given permission (or at least one, if an array is passed)
    hasPermission(permission) {
        if (!this.#permissions || this.#permissions.length === 0) {
            return false;
        }

        if (Array.isArray(permission)) {
            // permission is an array like ['user:delete', 'settings:edit']
            // → check if the user has AT LEAST ONE of them
            return permission.some((p) => this.#permissions.includes(p));
        }

        // permission is a single string like 'user:create'
        // → just check if the user has that one
        return this.#permissions.includes(permission);
    }
  }
  export default Authentication;