class AuthService {
  static async login() {
    return new Promise((resolve) =>
      setTimeout(
        () =>
          resolve({
            username: "Mark Vu",
            password: "123456",
          }),
        300
      )
    );
  }
}

export default AuthService;
